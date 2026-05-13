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
});