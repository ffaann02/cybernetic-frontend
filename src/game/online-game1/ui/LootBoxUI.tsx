import { useContext } from "react";
import { GameContext } from "../../../contexts/GameContext";

const LootBoxUI = ({ isOpenLoot, setIsOpenLoot }) => {
    // Dog and cat image URLs

    const {setIsInteracting, setCurrentHit} = useContext(GameContext);

    const dogImages = [
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Collage_of_Nine_Dogs.jpg",
      "https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg",
      "https://www.healthypawspetinsurance.com/Images/V3/DogAndPuppyInsurance/Dog_CTA_Desktop_HeroImage.jpg",
      "https://s7d1.scene7.com/is/image/PETCO/puppy-090517-dog-featured-355w-200h-d",
      "https://s7d2.scene7.com/is/image/PetSmart/SV0401_CATEGORY_HERO-Dog-Dog-20160818?$SV0401$",
      "https://i.ytimg.com/vi/ZgE-ZRvlIlk/maxresdefault.jpg",
      "https://media-cldnry.s-nbcnews.com/image/upload/newscms/2017_17/1210958/23-year-old-dog-today-170428-tease.jpg",
      "http://www.dogster.com/wp-content/uploads/2017/11/A-retriever-dog-licking-his-lips-and-eating.jpg",
      "https://img.buzzfeed.com/buzzfeed-static/static/2017-08/9/11/enhanced/buzzfeed-prod-fastlane-02/enhanced-1731-1502293831-8.jpg?downsize=715:*&output-format=auto&output-quality=auto",
      "https://www.rspca.org.uk/webContent/staticImages/SectionImages/Dogs.jpg"
    ];
  
    const catImages = [
      "https://static.boredpanda.com/blog/wp-content/uploads/2018/04/5acb63d83493f__700-png.jpg",
      "https://www.argospetinsurance.co.uk/assets/uploads/2017/12/cat-pet-animal-domestic-104827.jpeg",
      "http://www.catster.com/wp-content/uploads/2017/08/A-fluffy-cat-looking-funny-surprised-or-concerned.jpg",
      "https://www.cats.org.uk/uploads/images/featurebox_sidebar_kids/grief-and-loss.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
      "https://www.petmd.com/sites/default/files/petmd-cat-happy-13.jpg",
      "https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&h=350",
      "https://www.telegraph.co.uk/content/dam/pets/2017/01/06/1-JS117202740-yana-two-face-cat-news_trans_NvBQzQNjv4BqJNqHJA5DVIMqgv_1zKR2kxRY9bnFVTp4QZlQjJfe6H0.jpg?imwidth=450%27"
    ];
  
    const allImages = [...dogImages, ...catImages];
  
    // Shuffle the array
    const shuffledImages = allImages.sort(() => 0.5 - Math.random());
  
    // Get the first 18 unique images
    const uniqueImages = shuffledImages.slice(0, 18);

    const handleCollectAllData = () => {
        setIsOpenLoot(false);
        setIsInteracting(false);
        setCurrentHit("");
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute top-[20%] left-1/2 transform -translate-x-1/2 max-w-xl w-full h-fit
         bg-cyan-400/50 rounded-xl pt-3 px-4 pb-3"
        >
          <p className="text-white text-2xl text-center">Data Storage</p>
          <div className="w-full grid grid-cols-6 gap-2 mt-2 mx-auto">
            {uniqueImages.map((image, index) => (
              <div key={index} className="h-20 bg-white/50 border rounded-lg hover:bg-cyan-400">
                <img src={image} alt="Animal" className="h-full w-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
          <div className="text-right mt-0.5">
            <button className="px-3 py-2 bg-white text-slate-500 mt-2 rounded-lg hover:bg-green-200"
                onClick={handleCollectAllData}>
              Collect All Data
            </button>
          </div>
        </div>
      </div>
    );
  };
  export default LootBoxUI;