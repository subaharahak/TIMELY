// Timely - Smart Attendance System
// Main JavaScript file with Modern Chrome/Neon UI

class TimelySystem {
    constructor() {
        this.students = this.loadStudents();
        this.attendance = this.loadAttendance();
        this.faceDescriptors = this.loadFaceDescriptors();
        this.currentStream = null;
        this.recognitionInterval = null;
        this.isRecognitionActive = false;
        this.capturedFaceData = null;
        this.modelsLoaded = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.renderStudentsGrid();
        this.renderAttendanceGrid();
        this.initScrollReveal();
        this.initCustomCursor();
        this.initScrollProgress();
        
        // Load face-api models
        this.loadFaceApiModels();
        
        // Ensure dashboard is visible by default
        this.showSection('dashboard');
    }

    // Initialize scroll reveal animations
    initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        // Observe all reveal elements
        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });

        // Enhanced scroll animations
        const enhancedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observe all enhanced scroll animation elements
        const enhancedElements = document.querySelectorAll('.scroll-fade-up, .scroll-fade-left, .scroll-fade-right, .scroll-scale, .scroll-rotate, .scroll-bounce');
        enhancedElements.forEach(el => {
            enhancedObserver.observe(el);
        });
    }

    // Initialize custom cursor
    initCustomCursor() {
        const cursor = document.getElementById('customCursor');
        if (!cursor) return;

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('button, a, .stat-card, .student-card, .action-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    // Initialize scroll progress and indicators
    initScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        const scrollDots = document.querySelectorAll('.scroll-dot');
        
        if (!progressBar) return;

        // Update progress bar
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });

        // Update scroll indicator dots
        const sections = ['dashboard', 'register', 'attendance', 'students'];
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '-50px 0px -50px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;
                const dotIndex = sections.indexOf(sectionId);
                const dot = scrollDots[dotIndex];
                
                if (entry.isIntersecting && dot) {
                    scrollDots.forEach(d => d.classList.remove('active'));
                    dot.classList.add('active');
                }
            });
        }, observerOptions);

        // Observe all sections
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) sectionObserver.observe(section);
        });

        // Click on dots to scroll to sections
        scrollDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const sectionId = sections[index];
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Load face-api.js models
    async loadFaceApiModels() {
        try {
            console.log('Loading face-api.js models...');
            
            // Load all required models with correct path
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('./models')
            ]);
            
            console.log('✅ Face API models loaded successfully');
            this.showNotification('AI Face Recognition models loaded successfully!', 'success');
            this.modelsLoaded = true;
        } catch (error) {
            console.error('❌ Error loading face API models:', error);
            this.showNotification('Face recognition models failed to load. Using fallback mode.', 'warning');
            this.modelsLoaded = false;
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.showSection(target);
            });
        });

        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }

        // Registration camera controls
        const startCameraBtn = document.getElementById('startCamera');
        const captureFaceBtn = document.getElementById('captureFace');
        const retakeFaceBtn = document.getElementById('retakeFace');
        
        if (startCameraBtn) {
            startCameraBtn.addEventListener('click', () => {
                this.startRegistrationCamera();
            });
        }
        
        if (captureFaceBtn) {
            captureFaceBtn.addEventListener('click', () => {
                this.captureFace();
            });
        }
        
        if (retakeFaceBtn) {
            retakeFaceBtn.addEventListener('click', () => {
                this.retakeFace();
            });
        }

        // Student form
        const studentForm = document.getElementById('studentForm');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.registerStudent();
            });
        }

        // Attendance camera controls
        const startAttendanceCameraBtn = document.getElementById('startAttendanceCamera');
        const stopAttendanceCameraBtn = document.getElementById('stopAttendanceCamera');
        
        if (startAttendanceCameraBtn) {
            startAttendanceCameraBtn.addEventListener('click', () => {
                this.startAttendanceRecognition();
            });
        }
        
        if (stopAttendanceCameraBtn) {
            stopAttendanceCameraBtn.addEventListener('click', () => {
                this.stopAttendanceRecognition();
            });
        }

        // Search functionality
        const searchStudentsInput = document.getElementById('searchStudents');
        if (searchStudentsInput) {
            searchStudentsInput.addEventListener('input', (e) => {
                this.searchStudents(e.target.value);
            });
        }

        // Add smooth scrolling for navigation
        this.setupSmoothScrolling();
    }

    // Setup smooth scrolling behavior
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Navigation
    showSection(sectionId) {
        console.log('Showing section:', sectionId);
        
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Trigger scroll reveal for new section
            setTimeout(() => {
                this.initScrollReveal();
            }, 100);
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Camera Management
    async startRegistrationCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280, min: 640 },
                    height: { ideal: 720, min: 480 },
                    facingMode: 'user',
                    frameRate: { ideal: 30, min: 15 }
                } 
            });
            
            const video = document.getElementById('registerVideo');
            video.srcObject = stream;
            this.currentStream = stream;

            // Wait for video to load and apply quality settings
            video.onloadedmetadata = () => {
                video.play();
                // Apply quality enhancements
                video.style.imageRendering = 'auto';
                video.style.objectFit = 'cover';
                video.style.filter = 'none';
            };

            document.getElementById('startCamera').disabled = true;
            document.getElementById('captureFace').disabled = false;
            document.getElementById('faceOverlay').style.display = 'flex';

            this.showNotification('Camera started successfully', 'success');
        } catch (error) {
            console.error('Error starting camera:', error);
            this.showNotification('Error starting camera. Please check permissions.', 'error');
        }
    }

    async captureFace() {
        console.log('📸 Capturing face...');
        
        const video = document.getElementById('registerVideo');
        const canvas = document.getElementById('registerCanvas');
        const context = canvas.getContext('2d');

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0);
        
        console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);

        // Show loading state
        this.showNotification('Detecting face...', 'info');

        // Get face data
        const faceData = await this.detectFace(canvas);
        
        if (faceData) {
            console.log('✅ Face captured successfully!');
            this.capturedFaceData = faceData;
            
            // Update UI
            document.getElementById('captureFace').style.display = 'none';
            document.getElementById('retakeFace').style.display = 'inline-flex';
            document.getElementById('registerStudent').disabled = false;
            
            // Show success message with confidence
            const confidence = faceData.confidence ? 
                ` (Confidence: ${(faceData.confidence * 100).toFixed(1)}%)` : '';
            this.showNotification(`Face captured successfully!${confidence}`, 'success');
        } else {
            console.log('❌ No face detected');
            this.showNotification('No face detected. Please ensure your face is clearly visible in the frame and try again.', 'warning');
        }
    }

    retakeFace() {
        this.capturedFaceData = null;
        document.getElementById('captureFace').style.display = 'inline-flex';
        document.getElementById('retakeFace').style.display = 'none';
        document.getElementById('registerStudent').disabled = true;
        document.getElementById('faceOverlay').style.display = 'flex';
    }

    async detectFace(canvas) {
        try {
            console.log('🔍 Starting face detection...');
            
            // Check if models are loaded
            if (!this.modelsLoaded) {
                console.log('⚠️ Models not loaded, using fallback detection');
                return this.simpleFaceDetection(canvas);
            }
            
            // Use face-api.js for proper face detection
            if (typeof faceapi !== 'undefined') {
                console.log('🤖 Using face-api.js for detection...');
                
                // Detect face with landmarks and descriptor
                const detection = await faceapi
                    .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions({
                        inputSize: 512,
                        scoreThreshold: 0.5
                    }))
                    .withFaceLandmarks()
                    .withFaceDescriptor();
                
                if (detection) {
                    console.log('✅ Face detected successfully!');
                    console.log('Face confidence:', detection.detection.score);
                    
                    return {
                        descriptor: detection.descriptor,
                        landmarks: detection.landmarks,
                        imageData: canvas.toDataURL('image/jpeg', 0.9),
                        confidence: detection.detection.score,
                        box: detection.detection.box
                    };
                } else {
                    console.log('❌ No face detected by face-api.js');
                    return null;
                }
            } else {
                console.log('⚠️ face-api.js not available, using fallback');
                return this.simpleFaceDetection(canvas);
            }
        } catch (error) {
            console.error('❌ Face detection error:', error);
            console.log('🔄 Falling back to simple detection...');
            return this.simpleFaceDetection(canvas);
        }
    }

    simpleFaceDetection(canvas) {
        console.log('🔄 Using simple fallback face detection...');
        
        const context = canvas.getContext('2d');
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Enhanced skin tone detection
        let skinPixels = 0;
        let totalPixels = 0;
        
        // Sample every 4th pixel for performance
        for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Enhanced skin tone detection algorithm
            if (r > 80 && g > 30 && b > 15 && 
                Math.max(r, g, b) - Math.min(r, g, b) > 10 &&
                Math.abs(r - g) > 10 && r > g && r > b &&
                r < 255 && g < 255 && b < 255) {
                skinPixels++;
            }
            totalPixels++;
        }
        
        const skinPercentage = skinPixels / totalPixels;
        console.log(`Skin tone percentage: ${(skinPercentage * 100).toFixed(2)}%`);
        
        // Lower threshold for better detection
        if (skinPercentage > 0.05) { // If more than 5% of pixels are skin tone
            console.log('✅ Face detected using fallback method');
            return {
                descriptor: this.generateSimpleDescriptor(),
                landmarks: null,
                imageData: canvas.toDataURL('image/jpeg', 0.9),
                confidence: skinPercentage,
                method: 'fallback'
            };
        }
        
        console.log('❌ No face detected using fallback method');
        return null;
    }

    generateSimpleDescriptor() {
        // Generate a simple face descriptor for fallback
        const descriptor = new Float32Array(128);
        for (let i = 0; i < 128; i++) {
            descriptor[i] = Math.random() * 2 - 1;
        }
        return descriptor;
    }

    // Student Registration
    async registerStudent() {
        if (!this.capturedFaceData) {
            this.showNotification('Please capture a face first', 'warning');
            return;
        }

        const formData = {
            id: document.getElementById('studentId').value,
            name: document.getElementById('studentName').value,
            class: document.getElementById('studentClass').value,
            email: document.getElementById('studentEmail').value,
            goals: document.getElementById('studentGoals').value,
            faceData: this.capturedFaceData,
            registeredAt: new Date().toISOString()
        };

        // Check if student ID already exists
        if (this.students.find(s => s.id === formData.id)) {
            this.showNotification('Student ID already exists', 'error');
            return;
        }

        // Add student
        this.students.push(formData);
        this.faceDescriptors.push({
            id: formData.id,
            descriptor: formData.faceData.descriptor
        });

        // Save data
        this.saveStudents();
        this.saveFaceDescriptors();

        // Update UI
        this.updateDashboard();
        this.renderStudentsGrid();

        // Show success modal
        this.showSuccessModal(`Student ${formData.name} registered successfully!`);

        // Reset form
        this.resetRegistrationForm();
    }

    resetRegistrationForm() {
        document.getElementById('studentForm').reset();
        this.capturedFaceData = null;
        document.getElementById('captureFace').style.display = 'inline-flex';
        document.getElementById('retakeFace').style.display = 'none';
        document.getElementById('registerStudent').disabled = true;
        document.getElementById('faceOverlay').style.display = 'flex';
        
        // Stop camera
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(track => track.stop());
            this.currentStream = null;
        }
        
        document.getElementById('startCamera').disabled = false;
        document.getElementById('captureFace').disabled = true;
    }

    // Attendance Recognition
    async startAttendanceRecognition() {
        try {
            console.log('🎥 Starting attendance camera...');
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280, min: 640 },
                    height: { ideal: 720, min: 480 },
                    facingMode: 'user',
                    frameRate: { ideal: 30, min: 15 }
                } 
            });
            
            const video = document.getElementById('attendanceVideo');
            video.srcObject = stream;
            this.currentStream = stream;

            // Wait for video to load and apply quality settings
            video.onloadedmetadata = () => {
                video.play();
                // Apply quality enhancements
                video.style.imageRendering = 'auto';
                video.style.objectFit = 'cover';
                video.style.filter = 'none';
                console.log(`📹 Video ready: ${video.videoWidth}x${video.videoHeight}`);
            };

            document.getElementById('startAttendanceCamera').disabled = true;
            document.getElementById('stopAttendanceCamera').disabled = false;
            this.isRecognitionActive = true;

            // Initialize status
            const statusElement = document.getElementById('recognitionStatus');
            if (statusElement) {
                statusElement.innerHTML = '<i class="fas fa-camera"></i><span>Camera starting...</span>';
                statusElement.style.color = '#667eea';
            }

            // Start recognition loop after a short delay
            setTimeout(() => {
                this.startRecognitionLoop();
            }, 2000);

            this.showNotification('Attendance recognition started', 'success');
        } catch (error) {
            console.error('❌ Error starting attendance camera:', error);
            this.showNotification('Error starting camera. Please check permissions.', 'error');
        }
    }

    stopAttendanceRecognition() {
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(track => track.stop());
            this.currentStream = null;
        }

        if (this.recognitionInterval) {
            clearInterval(this.recognitionInterval);
            this.recognitionInterval = null;
        }

        this.isRecognitionActive = false;
        document.getElementById('startAttendanceCamera').disabled = false;
        document.getElementById('stopAttendanceCamera').disabled = true;

        this.showNotification('Attendance recognition stopped', 'info');
    }

    startRecognitionLoop() {
        console.log('🔄 Starting attendance recognition loop...');
        
        this.recognitionInterval = setInterval(async () => {
            if (!this.isRecognitionActive) return;

            const video = document.getElementById('attendanceVideo');
            const canvas = document.getElementById('attendanceCanvas');
            const statusElement = document.getElementById('recognitionStatus');
            
            // Check if video is ready
            if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
                console.log('⚠️ Video not ready yet');
                return;
            }

            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            // Update status
            if (statusElement) {
                statusElement.innerHTML = '<i class="fas fa-search"></i><span>Scanning for faces...</span>';
            }

            try {
                const recognizedStudent = await this.recognizeFace(canvas);
                
                if (recognizedStudent) {
                    console.log(`✅ Recognized: ${recognizedStudent.name}`);
                    this.markAttendance(recognizedStudent);
                    
                    // Update status to show recognition
                    if (statusElement) {
                        statusElement.innerHTML = `<i class="fas fa-check-circle"></i><span>Recognized: ${recognizedStudent.name}</span>`;
                        statusElement.style.color = '#4ade80';
                    }
                } else {
                    // Update status to show no recognition
                    if (statusElement) {
                        statusElement.innerHTML = '<i class="fas fa-user-slash"></i><span>No face recognized</span>';
                        statusElement.style.color = '#f59e0b';
                    }
                }
            } catch (error) {
                console.error('❌ Recognition error:', error);
                if (statusElement) {
                    statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Recognition error</span>';
                    statusElement.style.color = '#ef4444';
                }
            }
        }, 3000); // Check every 3 seconds for better performance
    }

    async recognizeFace(canvas) {
        try {
            console.log('🔍 Recognizing face...');
            
            const faceData = await this.detectFace(canvas);
            if (!faceData) {
                console.log('❌ No face detected for recognition');
                return null;
            }

            if (this.faceDescriptors.length === 0) {
                console.log('⚠️ No registered faces to compare against');
                return null;
            }

            // Find best match
            let bestMatch = null;
            let bestDistance = Infinity;
            let recognitionThreshold = 0.6; // Default threshold

            console.log(`Comparing against ${this.faceDescriptors.length} registered faces...`);

            for (const storedFace of this.faceDescriptors) {
                const distance = this.calculateFaceDistance(faceData.descriptor, storedFace.descriptor);
                console.log(`Distance to ${storedFace.id}: ${distance.toFixed(3)}`);
                
                if (distance < bestDistance && distance < recognitionThreshold) {
                    bestDistance = distance;
                    bestMatch = storedFace;
                }
            }

            if (bestMatch) {
                console.log(`✅ Face recognized! Best match: ${bestMatch.id} (distance: ${bestDistance.toFixed(3)})`);
                return this.students.find(s => s.id === bestMatch.id);
            } else {
                console.log(`❌ No matching face found (best distance: ${bestDistance.toFixed(3)})`);
                return null;
            }
        } catch (error) {
            console.error('❌ Face recognition error:', error);
            return null;
        }
    }

    calculateFaceDistance(descriptor1, descriptor2) {
        // Calculate Euclidean distance between face descriptors
        let sum = 0;
        for (let i = 0; i < descriptor1.length; i++) {
            const diff = descriptor1[i] - descriptor2[i];
            sum += diff * diff;
        }
        return Math.sqrt(sum);
    }

    markAttendance(student) {
        const today = new Date().toDateString();
        
        // Check if already marked present today
        if (this.attendance[today] && this.attendance[today].find(a => a.studentId === student.id)) {
            console.log(`⚠️ ${student.name} already marked present today`);
            this.showNotification(`${student.name} already marked present today`, 'info');
            return;
        }

        // Add attendance record
        if (!this.attendance[today]) {
            this.attendance[today] = [];
        }

        const attendanceRecord = {
            studentId: student.id,
            name: student.name,
            class: student.class,
            time: new Date().toLocaleTimeString(),
            faceImage: student.faceData.imageData
        };

        this.attendance[today].push(attendanceRecord);
        this.saveAttendance();

        console.log(`✅ Marked attendance for ${student.name}`);

        // Show recognition modal
        this.showRecognitionModal(attendanceRecord);

        // Update UI
        this.updateDashboard();
        this.renderAttendanceGrid();

        // Show success notification
        this.showNotification(`Attendance marked for ${student.name}`, 'success');
    }

    // UI Updates
    updateDashboard() {
        const totalStudents = this.students.length;
        const today = new Date().toDateString();
        const presentToday = this.attendance[today] ? this.attendance[today].length : 0;
        const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

        const totalStudentsEl = document.getElementById('totalStudents');
        const presentTodayEl = document.getElementById('presentToday');
        const attendanceRateEl = document.getElementById('attendanceRate');
        
        if (totalStudentsEl) totalStudentsEl.textContent = totalStudents;
        if (presentTodayEl) presentTodayEl.textContent = presentToday;
        if (attendanceRateEl) attendanceRateEl.textContent = `${attendanceRate}%`;
    }

    renderStudentsGrid() {
        const grid = document.getElementById('studentsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';

        this.students.forEach(student => {
            const card = this.createStudentCard(student);
            grid.appendChild(card);
        });
    }

    createStudentCard(student) {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div class="student-avatar">
                <img src="${student.faceData.imageData}" alt="${student.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2240%22 fill=%22%23667eea%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2220%22>${student.name.charAt(0)}</text></svg>'">
            </div>
            <div class="student-info">
                <h4>${student.name}</h4>
                <p><strong>ID:</strong> ${student.id}</p>
                <p><strong>Class:</strong> ${student.class}</p>
                ${student.email ? `<p><strong>Email:</strong> ${student.email}</p>` : ''}
                ${student.goals ? `<p><strong>Goals:</strong> ${student.goals.substring(0, 50)}${student.goals.length > 50 ? '...' : ''}</p>` : ''}
            </div>
            <div class="student-actions">
                <button class="btn secondary btn-sm" onclick="timelySystem.deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return card;
    }

    renderAttendanceGrid() {
        const grid = document.getElementById('attendanceGrid');
        if (!grid) return;
        
        const today = new Date().toDateString();
        const todayAttendance = this.attendance[today] || [];

        grid.innerHTML = '';

        if (todayAttendance.length === 0) {
            grid.innerHTML = '<p class="text-center text-secondary">No attendance records for today</p>';
            return;
        }

        todayAttendance.forEach(record => {
            const item = this.createAttendanceItem(record);
            grid.appendChild(item);
        });
    }

    createAttendanceItem(record) {
        const item = document.createElement('div');
        item.className = 'attendance-item';
        item.innerHTML = `
            <div class="attendance-avatar">
                <img src="${record.faceImage}" alt="${record.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2240%22 fill=%22%234ade80%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2220%22>${record.name.charAt(0)}</text></svg>'">
            </div>
            <div class="attendance-details">
                <h5>${record.name}</h5>
                <p><strong>Class:</strong> ${record.class}</p>
                <p><strong>Time:</strong> ${record.time}</p>
            </div>
            <div class="attendance-status">
                <i class="fas fa-check-circle text-success"></i>
                <span>Present</span>
            </div>
        `;
        return item;
    }

    searchStudents(query) {
        const grid = document.getElementById('studentsGrid');
        if (!grid) return;
        
        const filteredStudents = this.students.filter(student => 
            student.name.toLowerCase().includes(query.toLowerCase()) ||
            student.id.toLowerCase().includes(query.toLowerCase()) ||
            student.class.toLowerCase().includes(query.toLowerCase())
        );

        grid.innerHTML = '';
        filteredStudents.forEach(student => {
            const card = this.createStudentCard(student);
            grid.appendChild(card);
        });
    }

    // Student Management
    deleteStudent(studentId) {
        if (confirm('Are you sure you want to delete this student?')) {
            this.students = this.students.filter(s => s.id !== studentId);
            this.faceDescriptors = this.faceDescriptors.filter(f => f.id !== studentId);
            
            this.saveStudents();
            this.saveFaceDescriptors();
            
            this.updateDashboard();
            this.renderStudentsGrid();
            
            this.showNotification('Student deleted successfully', 'success');
        }
    }

    // Modals
    showSuccessModal(message) {
        const successMessageEl = document.getElementById('successMessage');
        const successModalEl = document.getElementById('successModal');
        
        if (successMessageEl) successMessageEl.textContent = message;
        if (successModalEl) successModalEl.classList.add('active');
    }

    closeModal() {
        const successModalEl = document.getElementById('successModal');
        if (successModalEl) successModalEl.classList.remove('active');
    }

    showRecognitionModal(attendanceRecord) {
        const recognizedFaceEl = document.getElementById('recognizedFace');
        const recognizedNameEl = document.getElementById('recognizedName');
        const recognizedIdEl = document.getElementById('recognizedId');
        const recognizedClassEl = document.getElementById('recognizedClass');
        const recognizedTimeEl = document.getElementById('recognizedTime');
        const recognitionModalEl = document.getElementById('recognitionModal');
        
        if (recognizedFaceEl) recognizedFaceEl.src = attendanceRecord.faceImage;
        if (recognizedNameEl) recognizedNameEl.textContent = attendanceRecord.name;
        if (recognizedIdEl) recognizedIdEl.textContent = attendanceRecord.studentId;
        if (recognizedClassEl) recognizedClassEl.textContent = attendanceRecord.class;
        if (recognizedTimeEl) recognizedTimeEl.textContent = attendanceRecord.time;
        if (recognitionModalEl) recognitionModalEl.classList.add('active');
    }

    closeRecognitionModal() {
        const recognitionModalEl = document.getElementById('recognitionModal');
        if (recognitionModalEl) recognitionModalEl.classList.remove('active');
    }

    // Notifications
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Data Persistence
    saveStudents() {
        localStorage.setItem('timely_students', JSON.stringify(this.students));
    }

    loadStudents() {
        const data = localStorage.getItem('timely_students');
        return data ? JSON.parse(data) : [];
    }

    saveAttendance() {
        localStorage.setItem('timely_attendance', JSON.stringify(this.attendance));
    }

    loadAttendance() {
        const data = localStorage.getItem('timely_attendance');
        return data ? JSON.parse(data) : {};
    }

    saveFaceDescriptors() {
        localStorage.setItem('timely_face_descriptors', JSON.stringify(this.faceDescriptors));
    }

    loadFaceDescriptors() {
        const data = localStorage.getItem('timely_face_descriptors');
        return data ? JSON.parse(data) : [];
    }
}

// Global functions for HTML onclick handlers
function showSection(sectionId) {
    if (timelySystem) {
        timelySystem.showSection(sectionId);
    }
}

function closeModal() {
    if (timelySystem) {
        timelySystem.closeModal();
    }
}

function closeRecognitionModal() {
    if (timelySystem) {
        timelySystem.closeRecognitionModal();
    }
}

// Authentication check
function checkAuthentication() {
    const user = localStorage.getItem('timely_user');
    if (!user) {
        // Redirect to login page if not authenticated
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        const userData = JSON.parse(user);
        console.log('User authenticated:', userData.email);
        return true;
    } catch (error) {
        console.error('Invalid user data:', error);
        localStorage.removeItem('timely_user');
        window.location.href = 'login.html';
        return false;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('timely_user');
    window.location.href = 'login.html';
}

// Initialize the system when page loads
let timelySystem;
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication first
    if (!checkAuthentication()) {
        return;
    }
    
    console.log('Initializing Timely System...');
    timelySystem = new TimelySystem();
    console.log('Timely System initialized successfully');
});

// Add scroll reveal functionality
window.addEventListener('scroll', () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });

    // Parallax effects
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');
    
    parallaxElements.forEach(element => {
        const speed = element.classList.contains('parallax-slow') ? 0.5 : 
                     element.classList.contains('parallax-medium') ? 0.8 : 1.2;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Add smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Add page load animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 3000;
        max-width: 400px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left: 4px solid #4ade80;
        color: #065f46;
    }

    .notification-error {
        border-left: 4px solid #f87171;
        color: #991b1b;
    }

    .notification-warning {
        border-left: 4px solid #fbbf24;
        color: #92400e;
    }

    .notification-info {
        border-left: 4px solid #667eea;
        color: #3730a3;
    }

    .notification i {
        font-size: 1.2rem;
    }
`;

// Add student card styles
const studentCardStyles = `
    .student-card {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        display: flex;
        gap: 1rem;
        align-items: center;
        transition: all 0.3s ease;
    }

    .student-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    .student-avatar {
        flex-shrink: 0;
    }

    .student-avatar img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #667eea;
    }

    .student-info {
        flex: 1;
    }

    .student-info h4 {
        color: #1f2937;
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
    }

    .student-info p {
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
    }

    .student-actions {
        flex-shrink: 0;
    }

    .btn-sm {
        padding: 0.5rem;
        font-size: 0.9rem;
    }

    .attendance-item {
        background: white;
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .attendance-details h5 {
        color: #1f2937;
        margin-bottom: 0.25rem;
        font-size: 1rem;
    }

    .attendance-details p {
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
    }

    .attendance-status {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #4ade80;
        font-weight: 600;
    }

    .text-success {
        color: #4ade80;
    }

    .text-secondary {
        color: #6b7280;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles + studentCardStyles;
document.head.appendChild(styleSheet);
