const initSlider = () => {
  const categoryList = document.querySelector(
    ".container .slider .category-list"
  );

  const slideButtons = document.querySelectorAll(".slider .slide-button");
  const maxScrollLeft = categoryList?.scrollWidth - categoryList?.clientWidth;
  const scrollPercentage = 0.5;

  slideButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log(button);
      const direction = button.id === "prev-slide" ? -1 : 1;

      const scrollAmount =
        categoryList.clientWidth * direction * scrollPercentage;
      categoryList.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  });

  const handleSlideButtons = () => {
    slideButtons[0].style.display =
      categoryList.scrollLeft <= 0 ? "none" : " block";
    slideButtons[1].style.display =
      categoryList.scrollLeft >= maxScrollLeft ? "none" : "block";
  };

  categoryList.addEventListener("scroll", () => {
    console.log(categoryList.scrollLeft);
    handleSlideButtons();
  });
};

window.addEventListener("load", initSlider);
