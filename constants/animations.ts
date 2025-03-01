// Fade-in animations
const fadeInUp = {
    hidden: {opacity: 0, y: 40},
    visible: {opacity: 1, y: 0, transition: {duration: 0.6, ease: "easeOut"}}
};

const staggerChildren = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const cardHover = {
    rest: {scale: 1, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"},
    hover: {
        scale: 1.03,
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
        transition: {duration: 0.3, ease: "easeInOut"}
    }
};

const mainTestimonialCardHover = {
    rest: {scale: 1, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"},
    hover: {
        scale: 1.01,
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
        transition: {duration: 0.3, ease: "easeInOut"}
    }
}

const tabContentAnimation = {
    hidden: {opacity: 0, x: -20},
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1.0]
        }
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: {
            duration: 0.3
        }
    }
};


export {
    fadeInUp,
    staggerChildren,
    cardHover,
    mainTestimonialCardHover,
    tabContentAnimation
}