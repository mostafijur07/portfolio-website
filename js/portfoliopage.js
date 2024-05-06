
const certificates_img = document.querySelectorAll('.certificate_img');
const slide_left_button = document.querySelector('#slide_left_button');
const slide_right_button = document.querySelector('#slide_right_button');

let counter = 0;

const slide_certificate = () => {
    certificates_img.forEach( (certificate_img) => {
        certificate_img.style.transform = `translateX(-${counter * 400}px)`;
    })
}

slide_left_button.addEventListener('click', () => {
    counter++;
    slide_certificate();
})

slide_right_button.addEventListener('click', () => {
    counter--;
    slide_certificate();
})

