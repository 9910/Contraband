$(document).ready(function(){
    $(".button-collapse").sideNav();
    $(document).ready(function(){
        $('.parallax').parallax();
    });
    $('.carousel.carousel-slider').carousel({
        fullWidth: true,
        duration: 1000
    });
    autoplay();
    function autoplay() {
        setTimeout(autoplay, 10000);
        $('.carousel').carousel('next');
    }
});