<script>
  const loginContainer = document.getElementById('login-container');
  const compressorContainer = document.getElementById('compressor-container');
  const registerContainer = document.getElementById('register-container');
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');

  const uploadInput = document.getElementById('upload');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const compressBtn = document.getElementById('compress');
  const qualitySlider = document.getElementById('quality');
  const qualityValue = document.getElementById('quality-value');
  const sizeInfo = document.getElementById('size-info');
  const compressedImageDiv = document.getElementById('compressed-image');

  let originalFile, generatedOTP = '', registeredUsers = {};

  function showRegister() {
    loginContainer.style.display = "none";
    compressorContainer.style.display = "none";
    registerContainer.style.display = "block";
  }

  function showLogin() {
    loginContainer.style.display = "block";
    compressorContainer.style.display = "none";
    registerContainer.style.display = "none";
  }

  function isValidPassword(password) {
    const startsWithCapital = /^[A-Z]/.test(password);
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    return startsWithCapital && hasLetter && hasNumber && hasSpecial;
  }

  // OTP Simulation
  document.getElementById('send-otp').addEventListener('click', function () {
    const mobile = document.getElementById('reg-mobile').value;
    if (!/^\d{10}$/.test(mobile)) {
      alert("Enter a valid 10-digit mobile number.");
      return;
    }
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    alert(`📲 OTP sent (simulated): ${generatedOTP}`);
    document.getElementById('otp').style.display = 'block';
    document.getElementById('verify-btn').style.display = 'block';
  });

  // Registration
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const otpEntered = document.getElementById('otp').value;

    if (!isValidPassword(password)) {
      alert("❌ Password must start with a capital letter, contain at least one letter, one number, and one special character.");
      return;
    }

    if (otpEntered !== generatedOTP) {
      alert("❌ Incorrect OTP.");
      return;
    }

    registeredUsers[username] = password;
    alert("✅ Registration successful! You can now login.");
    showLogin();
  });

  // Login
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (!registeredUsers[user] || registeredUsers[user] !== pass) {
      alert("❌ Invalid username or password.");
      return;
    }

    if (!isValidPassword(pass)) {
      alert("❌ Password must meet security requirements.");
      return;
    }

    loginContainer.style.display = "none";
    compressorContainer.style.display = "block";
  });

  // Quality slider
  qualitySlider.addEventListener('input', () => {
    qualityValue.textContent = qualitySlider.value;
  });

  // Upload image
  uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    originalFile = file;
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const scale = 0.8; // Resize for efficiency
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Compress
  compressBtn.addEventListener('click', () => {
    if (!originalFile) return alert("Please upload an image.");

    const quality = parseFloat(qualitySlider.value);
    const format = 'image/webp';

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const originalSize = (originalFile.size / 1024).toFixed(2);
      const compressedSize = (blob.size / 1024).toFixed(2);

      sizeInfo.textContent = `Original: ${originalSize} KB | Compressed: ${compressedSize} KB | Reduced: ${(originalSize - compressedSize).toFixed(2)} KB`;

      const link = document.createElement('a');
      link.href = url;
      link.download = "compressed.webp";
      link.textContent = "⬇ Download Compressed Image";
      link.style.display = "block";
      link.style.marginTop = "10px";

      const preview = new Image();
      preview.src = url;
      preview.style.maxWidth = "100%";
      preview.style.marginTop = "10px";

      compressedImageDiv.innerHTML = "";
      compressedImageDiv.appendChild(preview);
      compressedImageDiv.appendChild(link);
    }, format, quality);
  });
</script>