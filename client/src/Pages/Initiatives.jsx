import { Button, Card, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Define the category list
const Category = [
  {
    categorysm: "WasteReduction",
    categorylg: "Waste Reduction and Recycling Programs",
  },
  {
    categorysm: "Agri-Sustain",
    categorylg: "Sustainable Agriculture",
  },
  {
    categorysm: "WaterConserve",
    categorylg: "Water Conservation",
  },
  {
    categorysm: "ClimateAction",
    categorylg: "Climate Action and Advocacy",
  },
  {
    categorysm: "EnvironmentEducation",
    categorylg: "Environmental Education and Awareness",
  },
  {
    categorysm: "Renewable Energy",
    categorylg: "Renewable Energy Projects",
  },
  {
    categorysm: "other",
    categorylg: "Other",
  },
];

const Initiatives = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [category, setCategory] = useState("All");
  const [openFilter, setOpenFilter] = useState(false);
  const [formData, setFormData] = useState({
    searchTerm: "",
    category: "",
    sort: "desc",
  });

  const [initiative, setInitiative] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  // console.log(formData);
  // console.log(initiative);

  const handleFilter = () => {
    setOpenFilter((prev) => !prev);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const categoryform = urlParams.get("category");
    const sortFromUrl = urlParams.get("sort");
    if (searchTermFromUrl || sortFromUrl || categoryform) {
      setFormData({
        ...formData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryform,
      });
    }

    const fetchInitiative = async () => {
      setLoading(true);

      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/initiative/getInitiatives?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setInitiative(data.initiatives);
        setLoading(false);
        if (data.initatives?.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchInitiative();
  }, [location.search]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchCategoryFromUrl = urlParams.get("category");
    const categoryTerm = searchCategoryFromUrl?.toString();
    if (categoryTerm) {
      setCategory(categoryTerm);
    }
  }, [location.search]);
  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      const searchTerm = e.target.value || ""; // Ensure searchTerm is not null or undefined
      setFormData({ ...formData, searchTerm });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setFormData({
        ...formData,
        sort: order,
      });
    }
    if (e.target.id === "category") {
      const categorynew = e.target.value || "";
      setFormData({ ...formData, category: categorynew });
    }
  };

  useEffect(() => {
    const initSlider = () => {
      const categoryList = document.querySelector(
        ".container .slider .category-list"
      );

      if (!categoryList) return; // Ensure categoryList exists before proceeding

      const slideButtons = document.querySelectorAll(".slider .slide-button");
      const maxScrollLeft = categoryList.scrollWidth - categoryList.clientWidth;
      const scrollPercentage = 0.5;

      slideButtons.forEach((button) => {
        button.addEventListener("click", () => {
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
        handleSlideButtons();
      });
    };

    initSlider();
  }, []);

  const handleCategory = (newCategory) => {
    setCategory(newCategory);
    navigate(`/initiatives?category=${encodeURIComponent(newCategory)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", formData.searchTerm);
    urlParams.set("sort", formData.sort);
    urlParams.set("category", formData.category);
    const searchQuery = urlParams.toString();
    navigate(`/initiatives?${searchQuery}`);
    setFormData({
      searchTerm: "",
      category: "",
      sort: "desc",
    });
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-sm   items-center mx-3 mt-8  lg:mt-8 sm:mx-8 lg:mx-16">
        <div className=" justify-self-start lg:justify-self-center">
          <Link to="/create">
            <Button className="px-1 " color="success" size="small">
              Create
            </Button>
          </Link>
        </div>
        <div
          className="order-1 lg:order-none relative   w-full
       top-1 col-span-2 lg:col-span-1"
        >
          {openFilter && (
            <div className="w-full border-2 bg-white px-4 py-4 rounded-xl  z-50 absolute">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1  gap-4 sm:grid-cols-3 justify-items-center"
              >
                <div>
                  <label className="font-semibold">Search: </label>
                  <TextInput
                    id="searchTerm"
                    className="rounded-xl outline-none w-full "
                    value={formData.searchTerm || ""}
                    onChange={handleChange}
                    type="text"
                  />
                </div>
                <div>
                  <label className="font-semibold">Sort:</label>
                  <Select
                    id="sort"
                    onChange={handleChange}
                    value={formData.sort}
                  >
                    <option value="desc">Latest</option>
                    <option value="asc">Oldest</option>
                  </Select>
                </div>
                <div>
                  <label className="font-semibold">Category:</label>
                  <Select
                    id="category"
                    onChange={handleChange}
                    value={formData.category}
                  >
                    <option value="">choose category</option>
                    <option value="Waste Reduction and Recycling Programs">
                      WasteReduction
                    </option>
                    <option value="Water Conservation"> WaterConserve</option>
                    <option value="Climate Action and Advocacy">
                      ClimateAction
                    </option>
                    <option value="Environmental Education and Awareness">
                      EnvironmentEducation
                    </option>
                    <option value="Waste Reduction and Recycling Programs"></option>
                  </Select>
                </div>
                <Button type="submit" outline gradient="purpleToPink">
                  Apply Filters
                </Button>
              </form>
            </div>
          )}

          <div className="container relative  mb-10">
            <div className="slider p-2">
              <button
                id="prev-slide"
                className="slide-button absolute -left-1 top-3"
              >
                <IoIosArrowDropleftCircle />
              </button>
              <div className="category-list w-full">
                {/* Mapping through categories to render buttons */}
                {Category.map((item, index) => (
                  <Button
                    size="xs"
                    className=" text-xs whitespace-nowrap"
                    key={index}
                    onClick={() => {
                      handleCategory(item.categorylg);
                    }}
                  >
                    {item.categorysm}
                  </Button>
                ))}
              </div>

              <button
                id="next-slide"
                className="slide-button absolute -right-1 top-2 flex lg:hidden "
              >
                <IoIosArrowDroprightCircle />
              </button>
            </div>
          </div>
        </div>
        <div className=" justify-self-end lg:justify-self-center">
          <Button
            onClick={handleFilter}
            className="px-1 "
            color="success"
            size="small"
          >
            filter
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center mb-10  justify-center mt-10 gap-10 mx-8">
        {initiative.map((item, index) => (
          <Link key={index} to={`/initiative/${item._id}/${item.userId}`}>
            <div className="h-[350px] relative w-[280px] border-2 px-4 rounded-xl flex flex-col py-4">
              <div>
                <img
                  className="h-[150px]  pb-2  w-[320px]"
                  src={item.image}
                ></img>
              </div>

              <div className="bottom-5">
                <p className="font-bold text-xl mb-4 text-gray-700 whitespace-wrap dark:text-gray-400">
                  {truncateTitle(item.projecttitle)}
                </p>
                <p className="font-normal  text-gray-700 dark:text-gray-400 text-sm">
                  {truncateDescription(item.description)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

function truncateDescription(description) {
  const words = description.split(" ");
  if (words.length > 20) {
    // Join the first 40 words and add "..."
    return words.slice(0, 16).join(" ") + "....";
  } else {
    return description;
  }
}

function truncateTitle(title) {
  const newtitle = title.split("");
  if (newtitle.length > 20) {
    const modifiedtitle = newtitle.slice(0, 20).join("") + "...";
    return modifiedtitle;
  } else {
    return title;
  }
}

export default Initiatives;
