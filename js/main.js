$(document).ready(function () {
    $('#mainCarousel .carousel-control').on('mousedown', function (e) {
        e.preventDefault();
    });

    $('#mainCarousel .carousel-control').on('click', function (e) {
        e.stopImmediatePropagation(); // block Bootstrap's document-level handler
        $('#mainCarousel').carousel($(this).data('slide'));
    });

    var _scrollTop;
    $(document).on('slide.bs.carousel', function () {
        _scrollTop = $(window).scrollTop();
    });
    $(document).on('slid.bs.carousel', function () {
        if (_scrollTop !== undefined) {
            $(window).scrollTop(_scrollTop);
        }
    });

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 60) {
            $('#mainNav').addClass('scrolled');
        } else {
            $('#mainNav').removeClass('scrolled');
        }
        updateActiveNav();
    });

    $('#mainNav .nav a[href^="#"]').on('click', function (e) {
        var target = $(this).attr('href');
        if (target === '#mainCarousel' || target === '#testimonialsCarousel') return;
        if ($(target).length) {
            e.preventDefault();
            var offset = $(target).offset().top - 50;
            $('html, body').animate({ scrollTop: offset }, 700, 'swing');
            if ($('.navbar-collapse').hasClass('in')) {
                $('.navbar-collapse').collapse('hide');
            }
        }
    });

    function updateActiveNav() {
        var scrollPos = $(window).scrollTop() + 80;
        $('#mainNav .nav a[href^="#"]').each(function () {
            var section = $($(this).attr('href'));
            if (section.length) {
                if (
                    section.offset().top <= scrollPos &&
                    section.offset().top + section.outerHeight() > scrollPos
                ) {
                    $('#mainNav .nav a').removeClass('active');
                    $(this).addClass('active');
                }
            }
        });
    }

    $('.btn-pricing').on('click', function () {
        var service = $(this).data('service');
        $('#modalForm input[type="checkbox"]').prop('checked', false);
        if (service) {
            $('#chk-' + service).prop('checked', true);
        }
        $('#pricingModal').modal('show');
    });

    $('#btnModalSubmit').on('click', function (e) {
        e.preventDefault();
        var valid = true;

        var name = $.trim($('#modal-name').val());
        var phone = $.trim($('#modal-phone').val());
        var email = $.trim($('#modal-email').val());
        var anyChecked = $('#modalForm input[type="checkbox"]:checked').length > 0;

        $('.modal-error').hide().text('');

        if (!name) {
            $('#err-modal-name').text('Vui lòng nhập họ tên.').show();
            valid = false;
        }
        if (!phone) {
            $('#err-modal-phone').text('Vui lòng nhập số điện thoại.').show();
            valid = false;
        }
        if (!email || !isValidEmail(email)) {
            $('#err-modal-email').text('Email không hợp lệ.').show();
            valid = false;
        }
        if (!anyChecked) {
            $('#err-modal-chk').text('Vui lòng chọn ít nhất 1 dịch vụ.').show();
            valid = false;
        }

        if (valid) {
            alert('Cảm ơn bạn đã đăng ký! Tech-Zone sẽ liên hệ sớm.');
            $('#pricingModal').modal('hide');
            $('#modalForm')[0].reset();
        }
    });

    $('#contactForm').on('submit', function (e) {
        e.preventDefault();
        var valid = true;

        var name = $.trim($('#contact-name').val());
        var email = $.trim($('#contact-email').val());
        var message = $.trim($('#contact-message').val());

        $('.contact-error').hide().text('');

        if (!name) {
            $('#err-contact-name').text('Vui lòng nhập tên.').show();
            valid = false;
        } else if (/\d/.test(name)) {
            $('#err-contact-name').text('Tên không được chứa ký tự số.').show();
            valid = false;
        }
        if (!email || !isValidEmail(email)) {
            $('#err-contact-email').text('Email không hợp lệ hoặc chưa nhập.').show();
            valid = false;
        }
        if (message.length < 20) {
            $('#err-contact-msg').text('Nội dung phải có ít nhất 20 ký tự (hiện: ' + message.length + ').').show();
            valid = false;
        }
        if (valid) {
            alert('Tin nhắn đã được gửi! Chúng tôi sẽ phản hồi trong 24h.');
            this.reset();
        }
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    $('#searchForm').on('submit', function (e) {
        e.preventDefault();
        var q = $.trim($('#searchInput').val());
        if (q) {
            window.location.href = 'product.html?search=' + encodeURIComponent(q);
        }
    });

    function revealOnScroll() {
        $('.fade-up').each(function () {
            var elemTop = $(this).offset().top;
            var windowBottom = $(window).scrollTop() + $(window).height();
            if (elemTop < windowBottom - 60) {
                $(this).addClass('visible');
            }
        });
    }
    $(window).on('scroll', revealOnScroll);
    revealOnScroll();

    // ===== AUTH =====
    function showLoggedIn(user) {
        var initial = (user.name || 'U').charAt(0).toUpperCase();
        $('.user-avatar-circle').text(initial);
        var parts = (user.name || '').trim().split(' ');
        $('.nav-username').text(parts[parts.length - 1] || user.email);
        $('.nav-auth-show').hide();
        $('.nav-user-show').show();
    }

    function showLoggedOut() {
        $('.nav-user-show').hide();
        $('.nav-auth-show').show();
    }

    function showToast(msg) {
        var toast = $('<div class="tz-toast"></div>').text(msg);
        $('body').append(toast);
        setTimeout(function () { toast.addClass('show'); }, 40);
        setTimeout(function () {
            toast.removeClass('show');
            setTimeout(function () { toast.remove(); }, 400);
        }, 3600);
    }

    // Load session on page load
    (function loadAuthState() {
        var raw = localStorage.getItem('tz_user');
        if (raw) { try { showLoggedIn(JSON.parse(raw)); } catch (e) { localStorage.removeItem('tz_user'); } }
    })();

    // Toggle password visibility
    $(document).on('click', '.btn-toggle-pw', function () {
        var input = $(this).closest('.input-password-wrap').find('input');
        var icon = $(this).find('.glyphicon');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
        } else {
            input.attr('type', 'password');
            icon.removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
        }
    });

    // Switch login ↔ register
    $('#switchToRegister').on('click', function (e) {
        e.preventDefault();
        $('#loginModal').modal('hide');
        setTimeout(function () { $('#registerModal').modal('show'); }, 380);
    });

    $('#switchToLogin').on('click', function (e) {
        e.preventDefault();
        $('#registerModal').modal('hide');
        setTimeout(function () { $('#loginModal').modal('show'); }, 380);
    });

    // Forgot password
    $('#forgotPwLink').on('click', function (e) {
        e.preventDefault();
        showToast('Tính năng đặt lại mật khẩu đang được phát triển. Vui lòng liên hệ hotline 1800 6789.');
    });

    // Login form submit
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        var email = $.trim($('#login-email').val());
        var pw = $('#login-password').val();
        var valid = true;
        $('#loginForm .error-msg').hide().text('');

        if (!email || !isValidEmail(email)) {
            $('#err-login-email').text('Email không hợp lệ.').show(); valid = false;
        }
        if (!pw || pw.length < 6) {
            $('#err-login-pw').text('Mật khẩu phải có ít nhất 6 ký tự.').show(); valid = false;
        }
        if (!valid) return;

        var users = JSON.parse(localStorage.getItem('tz_users') || '[]');
        var found = users.find(function (u) { return u.email === email && u.password === pw; });

        if (!found) {
            $('#err-login-pw').text('Email hoặc mật khẩu không đúng. Thử mật khẩu demo: 123456').show();
            return;
        }

        localStorage.setItem('tz_user', JSON.stringify(found));
        $('#loginModal').modal('hide');
        this.reset();
        showLoggedIn(found);
        showToast('Đăng nhập thành công! Chào mừng ' + found.name + '.');
    });

    // Register form submit
    $('#registerForm').on('submit', function (e) {
        e.preventDefault();
        var name = $.trim($('#reg-name').val());
        var email = $.trim($('#reg-email').val());
        var phone = $.trim($('#reg-phone').val()).replace(/\s/g, '');
        var pw = $('#reg-password').val();
        var cpw = $('#reg-confirm-pw').val();
        var agree = $('#agreeTerms').is(':checked');
        var valid = true;
        $('#registerForm .error-msg').hide().text('');

        if (!name) { $('#err-reg-name').text('Vui lòng nhập họ tên.').show(); valid = false; }
        if (!email || !isValidEmail(email)) { $('#err-reg-email').text('Email không hợp lệ.').show(); valid = false; }
        if (!phone || !/^[0-9]{9,11}$/.test(phone)) { $('#err-reg-phone').text('Số điện thoại phải có 9–11 chữ số.').show(); valid = false; }
        if (!pw || pw.length < 6) { $('#err-reg-pw').text('Mật khẩu phải có ít nhất 6 ký tự.').show(); valid = false; }
        if (pw !== cpw) { $('#err-reg-cpw').text('Mật khẩu xác nhận không khớp.').show(); valid = false; }
        if (!agree) { $('#err-reg-terms').text('Vui lòng đồng ý với điều khoản.').show(); valid = false; }
        if (!valid) return;

        var users = JSON.parse(localStorage.getItem('tz_users') || '[]');
        if (users.find(function (u) { return u.email === email; })) {
            $('#err-reg-email').text('Email này đã được đăng ký.').show(); return;
        }

        var newUser = { name: name, email: email, phone: phone, password: pw };
        users.push(newUser);
        localStorage.setItem('tz_users', JSON.stringify(users));
        localStorage.setItem('tz_user', JSON.stringify(newUser));

        $('#registerModal').modal('hide');
        this.reset();
        showLoggedIn(newUser);
        showToast('Đăng ký thành công! Chào mừng ' + name + ' đến với Tech-Zone.');
    });

    // Logout
    $(document).on('click', '#btnLogout', function (e) {
        e.preventDefault();
        localStorage.removeItem('tz_user');
        showLoggedOut();
        showToast('Bạn đã đăng xuất thành công.');
    });
});