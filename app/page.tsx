'use client';
import Head from 'next/head';
import '@/app/globals.css';
import axios from "axios"
import { Bodoni_Moda, Beau_Rivage, Roboto, Poppins, Vollkorn, Signika_Negative } from 'next/font/google';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';

// Import Image Wedding
import WeddingImage1 from "@/app/img/FOTO WEDDING/wedding.jpg";
import WeddingImage2 from "@/app/img/FOTO WEDDING/wedding2.jpg"
import WeddingImage3 from "@/app/img/FOTO WEDDING/wedding3.jpg"
import WeddingLanscape from "@/app/img/FOTO WEDDING/_WIL8393.jpg";
import FooterImage from "@/app/img/FOTO WEDDING/jeffry-ruth12.jpg"

// Import Image for Styling
import FlowerPNG from "@/app/img/flower.png";
import Flower2 from "@/app/img/flower2.png";
import Flower3 from "@/app/img/Flower3.png";
import Flower4 from "@/app/img/Flower4.png";
import FlowerAtas from "@/app/img/flower_atas.png";
import FlowerBawah from "@/app/img/flower_bawah.png";

// Import Icon
import { FaPlay, FaPause } from 'react-icons/fa';

// Import Dependeties for Swipeable
import { useSwipeable } from 'react-swipeable';

// Import Font
const LoraFont = Bodoni_Moda({
  weight: '400',
  subsets: ['latin']
});

const BeauFont = Beau_Rivage({
  weight: '400',
  subsets: ['latin']
});

const RobotoFont = Roboto({
  weight: '400',
  subsets: ['latin']
});

const PoppinsFont = Poppins({
  weight: '400',
  subsets: ['latin']
});

const PoppinsBold = Poppins({
  weight: '800',
  subsets: ['latin']
});

const VollkornbBold = Vollkorn({
  weight: "700",
  subsets: ['latin']
});

const SignikaFont = Signika_Negative({
  weight: '600',
  subsets: ['latin']
})

// Define the Comment type
interface Comment {
  id: number;
  name: string;
  message: string;
  timestamp: Date;
}

// List Image for background slide image
const images = [WeddingImage1];


// List Image For Gallery 
const imagesGallery = [WeddingImage1]

// Interface TimeLeft
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Initiati Const
  const flowerRef = useRef<HTMLImageElement>(null);
  const [isFlowerVisible, setIsFlowerVisible] = useState(false);
  const [isInvitationOpened, setIsInvitationOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentImageIndexSlide, setCurrentImageIndexSlide] = useState(0);
  const [to, setTo] = useState<string | undefined>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setTo(urlParams.get('to') ?? '');
      setName(urlParams.get('to') ?? ''); // Initialize name with the value of 'to'
    }
  }, []);

    const togglePlayPause = () => {
      if (isPlaying) {
        if (audioRef.current !== null) {
          (audioRef.current as HTMLAudioElement).pause();
        }
      } else {
        if (audioRef.current !== null) {
          audioRef.current.play();
        }
      }
      setIsPlaying(!isPlaying);
    };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndexSlide((prevIndex) => (prevIndex + 1) % imagesGallery.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, []);

  // Target CountDown
  useEffect(() => {
    // Change it - Target Countdown
    const targetDate = moment("2024-09-10");
    const updateCountdown = () => {
      const now = moment();
      const duration = moment.duration(targetDate.diff(now));
      setTimeLeft({
        days: duration.days(),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      });
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  // Ignore This
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsFlowerVisible(true);
        }
      });
    }, {
      threshold: 0.5,
    });

    if (flowerRef.current) {
      observer.observe(flowerRef.current);
    }

    return () => {
      if (flowerRef.current) {
        observer.unobserve(flowerRef.current);
      }
    };
  }, []);

  const handleSwipeLeft = () => {
    setCurrentImageIndexSlide((prevIndex) => {
      if (prevIndex < imagesGallery.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex; // Do not change if it's the last image
    });
  };

  const handleSwipeRight = () => {
    setCurrentImageIndexSlide((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex; // Do not change if it's the first image
    });
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    trackMouse: true
  });

  const handleOpenInvitation = () => {
    if (audioRef.current !== null) {
        audioRef.current.play().catch(error => {
        console.error("Error attempting to play audio:", error);
      });
      setIsPlaying(true);
    }
    setIsInvitationOpened(true);
  };
  
  const API_URL = 'https://api.darwan.xyz/api/commentbayu'; // Replace with your actual API URL - Don't Change it

  // Function to fetch comments from the backend
  const fetchComments = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log('Fetched comments:', response.data); // Log data fetched from API
      setComments(response.data);
      console.log('Comments state:', response.data); // Log state after setting comments
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Function to submit a new comment
  const submitComment = async () => {
    try {
      const newComment = {
        name,
        message,
        timestamp: new Date(),
      };
      await axios.post(API_URL, newComment);
      fetchComments(); // Refresh comments after posting
      setTo('');
      setMessage('');
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  useEffect(() => {
    fetchComments(); // Fetch comments on component mount
  }, []);

  const formatTimestamp = (timestamp: Date) => {
    return moment(timestamp).format('MMMM D, [at] HH:mm');
  };

  const [showPopup, setShowPopup] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const loadImage = (src: any) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    };

    Promise.all(images.map(img => loadImage(img.src)))
      .then(() => {
        setIsContentVisible(true);  // Konten ditampilkan setelah semua gambar selesai dimuat
      })
      .catch((error) => {
        console.error("Gagal memuat gambar:", error);
        setIsContentVisible(true);  // Tetap tampilkan konten meski ada gambar yang gagal dimuat
      });
  }, [images]);

  if (!isContentVisible) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
          <div className="text-lg font-semibold text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-x-hidden'>
      <Head>
        <title>Sanches Liza</title>
        <meta name="description" content="Floral Designer, Wedding Planner, and Event Enthusiast" />
      </Head>
      {!isInvitationOpened ? (
        <section className="h-screen relative">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center h-screen transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url(${image.src})` }}
            />
          ))}
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
            <div className="text-center">
              {/* Change Name For Invitaion Handle */}
              <h2 className="text-lg text-white">The Wedding of</h2>
              <h4 className={`${LoraFont.className} text-5xl pt-3 font-bold text-white`}>Nafa Fatma</h4>
              <h6 className={`text-3xl ${BeauFont.className} font-bold text-white mt-3`}>Azahra</h6>
              <h4 className={`text-2xl pt-3 ${LoraFont.className} text-white`}>&</h4>
              <h4 className={`${LoraFont.className} text-5xl pt-3 font-bold text-white`}>Wahyu</h4>
              <h6 className={`text-3xl ${BeauFont.className} font-bold text-white mt-3`}>Zulfirman</h6>
              <h2 className="text-sm text-white pt-32">Dear : Mrs and Mr</h2>
              <h2 className={`text-2xl text-white pt-3 ${LoraFont.className}`}>{to}</h2>
              <button 
                className="mt-10 px-6 py-3 bg-white text-black rounded-full font-bold transition duration-300 hover:bg-gray-200" 
                onClick={handleOpenInvitation}
              >
                Buka Undangan
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
      {/* Change Song */}
      <audio ref={audioRef} src="/song/song.mp3" autoPlay loop></audio>
      <section className="h-screen relative">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center h-screen transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${image.src})` }}
          />
        ))}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <header className="bg-transparent relative z-10">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <nav>
              {/* Change Name */}
              <a href="#left" className="mx-2 text-2xl playWrite text-white">Nafa</a>
            </nav>
            <nav>
              <a href="#right" className="mx-2 text-2xl playWrite text-white">Wahyu</a>
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
          <div className="text-center">
            <h2 className="text-lg text-white">The Wedding of</h2>
            <h4 className={`${LoraFont.className} text-5xl pt-3 font-bold text-white`}>Nafa Fatma</h4>
            <h6 className={`text-3xl ${BeauFont.className} font-bold text-white mt-3`}>Azahra</h6>
            <h4 className={`text-2xl pt-3 ${LoraFont.className} text-white`}>&</h4>
            <h4 className={`${LoraFont.className} text-5xl pt-3 font-bold text-white`}>Wahyu</h4>
            <h6 className={`text-3xl ${BeauFont.className} font-bold text-white mt-3`}>Zulfirman</h6>
          </div>
        </div>
      </section>

      <section className="py-32 xl:py-72 bg-cover bg-center relative" style={{ backgroundImage: `url(${WeddingImage2.src})` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className={`container mx-auto px-4 text-center ${PoppinsFont.className} text-white relative`}>
          <h2 className="text-4xl font-bold">Save the Date</h2>
          <p className='text-xs pt-5'>&quot;Seperti matahari terbenam yang indah, cinta kami bersinar. Bergabunglah dengan kami dalam merayakan awal baru ini.&quot;</p>
          <div className="flex justify-center mt-4">
            <svg className="pulse-animation" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <div className="countdown mt-6 text-lg font-bold">
            <p className='py-2'>
              <span className='bg-white p-3 text-black rounded-xl'>{`${timeLeft.days}d`}</span> :
              <span className='bg-white p-3 text-black rounded-xl ml-2'>{`${timeLeft.hours}h`}</span> :
              <span className='bg-white p-3 text-black rounded-xl ml-2'>{`${timeLeft.minutes}m`}</span> :
              <span className='bg-white p-3 text-black rounded-xl ml-2'>{`${timeLeft.seconds}s`}</span>
            </p>
          </div>
          <p className="text-sm mt-4">Selasa, 10 September 2024</p>
          <div className='pt-8'>
            <a href="/savethedate.ics" download="/savethedate.ics" >
              <button className={`bg-white text-black p-2 rounded-lg hover:shadow-md ${PoppinsFont.className}`}>Save The Date</button>
            </a>
          </div>
        </div>
      </section>
      <section className="py-72 xl:py-96 2xl:py-[600px] bg-cover bg-center relative" style={{ backgroundImage: `url(${WeddingImage3.src})` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {/* Social Media Section */}
        <div className="px-4 lg:px-56 2xl:px-96 lg:flex mt-12 absolute top-24 w-full">
          <div className="flex flex-wrap justify-start items-center w-full lg:w-1/2 p-4 lg:mt-28">
            <div className="bg-opacity-10 p-6 rounded-lg text-white" style={{background: 'linear-gradient(90deg, rgba(128,128,128,1) 0%, rgba(56,103,134,0.7189469537815126) 0%, rgba(110,246,255,0) 100%)'}}>
              <div className="relative z-10 text-opacity-100">
                <h3 className="text-xl font-bold mb-2">Nafa Fatma Azahra</h3>
                <p className="text-xs">Putri Kedua dari Bpk. Nung Nurrochman & Ibu Rohimatul Wahidah</p>
                <div className='border py-1 mt-2 text-center flex justify-center items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" className='mr-2'>
                    <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z"/>
                  </svg>
                  <a href="https://www.instagram.com/xxnfzra_/" className="text-xs py-1">@xxnfzra_</a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-end items-center w-full lg:w-1/2 p-4 lg:mt-28">
            <div className="bg-opacity-10 p-6 rounded-lg text-white" style={{background: 'linear-gradient(90deg, rgba(128,128,128,1) 0%, rgba(56,103,134,0.7189469537815126) 0%, rgba(110,246,255,0) 100%)'}}>
              <div className="relative z-10 text-opacity-100">
                <h3 className="text-xl font-bold mb-2">Wahyu Zulfirman</h3>
                <p className="text-xs">Putra Kedua dari Bpk. Aburani (Alm) & Ibu Rosmidar</p>
                <div className='border py-1 mt-2 text-center flex justify-center items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" className='mr-2'>
                    <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z"/>
                  </svg>
                  <a href="https://www.instagram.com/wahyu.zulfirmannn/" className="text-xs py-1">@wahyu.zulfirmannn</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Wave SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className='absolute bottom-0 left-0 w-full'>
          <path fill="#f1f5f9" fillOpacity="1" d="M0,0L30,10.7C60,21,120,43,180,80C240,117,300,171,360,165.3C420,160,480,96,540,106.7C600,117,660,203,720,213.3C780,224,840,160,900,160C960,160,1020,224,1080,218.7C1140,213,1200,139,1260,101.3C1320,64,1380,64,1410,64L1440,64L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"></path>
        </svg>
      </section>

      <div className='bg-slate-100 w-full h-full flex flex-col justify-center items-center py-6 -mt-1 relative'>

        {/* Resepsi */}
        <div className='relative w-full h-full flex justify-center items-center py-6'>
          <img alt="Flower" src={Flower3.src} className="absolute w-fit h-full animate-wiggle" />
          <div className='bg-white shadow-md rounded-md w-64 h-[500px] text-center flex flex-col justify-center items-center rounded-t-full z-10'>
            <div className='flex flex-col justify-center items-center'>
            <svg height="100px" className='justify-center items-center' width="80px" version="1.1" id="_x32_" xmlns="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000000">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <style type="text/css"> </style>
                  <g>
                    <path className="st0" d="M512,223.537c0-61.46-49.773-111.264-111.264-111.264c-11.768,0-22.922,2.31-33.496,5.644C366.948,56.657,317.346,7.084,255.985,7.084c-61.32,0-110.993,49.573-111.224,110.833c-10.573-3.334-21.728-5.644-33.496-5.644C49.774,112.273,0,162.077,0,223.537c0,49.241,32.171,90.479,76.533,105.12c-13.294,18.354-21.276,40.656-21.276,64.985c0,61.46,49.773,111.274,111.254,111.274c36.86,0,69.222-18.043,89.475-45.646c20.283,27.603,52.645,45.646,89.465,45.646c61.521,0,111.264-49.813,111.264-111.274c0-24.329-7.993-46.631-21.246-64.985C479.829,314.017,512,272.779,512,223.537z M255.985,337.433c-31.971,0-57.927-25.916-57.927-57.887c0-31.981,25.956-57.897,57.927-57.897c32,0,57.926,25.916,57.926,57.897C313.912,311.517,287.986,337.433,255.985,337.433z"></path>
                  </g>
                </g>
              </svg>
              <h1 className={`text-2xl font-bold ${PoppinsBold.className}`}>Akad Nikah</h1>
              <div className={`${RobotoFont.className} pt-4 text-sm mx-5`}>
                <h1>MINGGU</h1>
                <h1 className='text-4xl font-bold'>15</h1>
                <h1 className='font-bold'>September 2024</h1>
                <h1>Pukul : 10.00 - 18.00 WIB</h1>
                {/* Location */}
                <div className='pt-4'>
                  <h1 className='text-xs'>Rumah</h1>
                  <h1 className='text-xs'>Jl. Karanganyar Kesambi No. 61 RT. 01 RW. 02 Kel. Kesambi Kec. Kesambi Kota Cirebon</h1>
                </div>
              </div>
            </div>
            <button className='bg-gray-200 w-52 h-10 rounded-full mt-4'>
              <div className='flex text-center items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <a href='https://maps.app.goo.gl/DpH2UGq33iZxFBjy7' className='pl-1'>Lokasi Acara</a>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-neutral-200 w-full h-full relative">
      <img 
        src={FlowerAtas.src} 
        alt="Bunga Atas" 
        className="w-full h-auto mb-4 flower animate-flower xl:w-[600px] absolute top-0 right-0" 
        ref={flowerRef} 
      />
      <h1 className={`text-black text-center ${VollkornbBold.className} text-3xl mb-6 pt-48`}>Give wishes</h1>

      {/* Form Beri Ucapan */}
      <div className='px-8 xl:px-96'>
        <div className='pt-1'>
          <input 
            type='text' 
            className='block w-full p-2 mb-4 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
            placeholder='Name'
            value={to}
            onChange={(e) => setTo(e.target.value)}  // Ubah to saat input berubah
          />
          <textarea 
            placeholder='Give us your wishes' 
            className='block w-full p-2 mb-4 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button 
          className='w-full p-2 bg-pink-950 text-white rounded-md hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
          onClick={submitComment}
        >
          <span className={`${PoppinsFont.className}`}>Give Wishes</span>
        </button>
        <h1 className='text-center'>Or</h1>
        <button 
          className='w-full p-2 bg-pink-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center space-x-2' 
          onClick={() => setShowPopup(!showPopup)}
        >
          <span className={`${PoppinsFont.className}`}>Send Gift / Money</span>
          <svg height="20" viewBox="0 0 511.99789 511" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="m43.980469 189.71875h424.039062v314.53125h-424.039062zm0 0" fill="#ffc73b"/>
            <path d="m43.980469 189.71875h424.039062v61.628906h-424.039062zm0 0" fill="#efb025"/>
            <path d="m7.902344 110.710938h496.195312v105.875h-496.195312zm0 0" fill="#ffc73b"/>
            <path d="m255.996094 145.824219c-3.226563 3.75-6.386719 7.550781-9.472656 11.398437-11.496094 14.304688-22.019532 29.296875-31.53125 44.859375-30.207032 49.367188-50.265626 104.523438-58.726563 162.246094-12.714844-16.867187-24.453125-35.117187-35.007813-54.628906-18.574218 12.117187-36.726562 25.972656-54.207031 41.5625 8.976563-61.230469 28.753907-120.082031 58.125-173.90625 15.6875-28.761719 34.125-56.089844 55.121094-81.574219 2.425781-2.960938 4.890625-5.878906 7.386719-8.789062 10.609375 9.136718 21.207031 18.269531 31.816406 27.402343 10.839844 9.335938 21.683594 18.667969 32.523438 28.015625 1.328124 1.125 2.644531 2.273438 3.972656 3.414063zm0 0" fill="#ff4440"/>
            <path d="m444.949219 351.261719c-17.480469-15.589844-35.632813-29.445313-54.207031-41.5625-10.554688 19.511719-22.292969 37.761719-35.007813 54.628906-8.460937-57.722656-28.519531-112.878906-58.726563-162.246094-9.511718-15.5625-20.046874-30.554687-31.53125-44.859375-3.097656-3.847656-6.257812-7.648437-9.480468-11.398437 1.324218-1.140625 2.644531-2.277344 3.96875-3.414063 10.851562-9.347656 21.695312-18.691406 32.535156-28.015625 10.609375-9.144531 21.21875-18.265625 31.816406-27.402343 2.496094 2.898437 4.960938 5.828124 7.386719 8.777343 20.996094 25.484375 39.433594 52.8125 55.132813 81.585938 29.359374 53.824219 49.136718 112.675781 58.113281 173.90625zm0 0" fill="#ff4440"/>
            <path d="m386.835938 177.355469-89.828126 24.726562c-9.511718-15.5625-20.046874-30.554687-31.53125-44.859375l-5.511718-14.8125-3.96875-10.683594 36.503906-17.332031 39.203125-18.625c20.996094 25.484375 39.433594 52.8125 55.132813 81.585938zm0 0" fill="#ea2f2f"/>
            <path d="m255.996094 131.726562-3.972656 10.683594-5.5 14.8125c-11.496094 14.304688-22.019532 29.296875-31.53125 44.859375l-89.816407-24.726562c15.6875-28.761719 34.125-56.089844 55.121094-81.574219l39.203125 18.613281zm0 0" fill="#ea2f2f"/>
            <g fill="#ff4440">
              <path d="m399.355469 11.8125-143.355469 68.082031 27.535156 74.058594 153.007813-42.117187c20.015625-5.507813 31.007812-26.984376 23.773437-46.4375l-12.628906-33.957032c-7.234375-19.457031-29.585938-28.53125-48.332031-19.628906zm0 0"/>
              <path d="m112.648438 11.8125 143.351562 68.082031-27.535156 74.058594-153.007813-42.117187c-20.011719-5.507813-31.007812-26.984376-23.773437-46.4375l12.628906-33.957032c7.234375-19.457031 29.585938-28.53125 48.335938-19.628906zm0 0"/>
              <path d="m278.476562 54.441406h-44.953124c-12.304688 0-22.28125 9.972656-22.28125 22.277344v65.316406c0 12.304688 9.976562 22.28125 22.28125 22.28125h44.953124c12.308594 0 22.28125-9.976562 22.28125-22.28125v-65.316406c0-12.304688-9.976562-22.277344-22.28125-22.277344zm0 0"/>
              <path d="m216.496094 216.585938h79.007812v287.664062h-79.007812zm0 0"/>
            </g>
            <path d="m216.496094 216.585938h79.007812v34.761718h-79.007812zm0 0" fill="#ea2f2f"/>
            <path d="m504.097656 102.808594h-41.6875c1.210938-1.699219 2.308594-3.484375 3.269532-5.355469 5.515624-10.773437 6.261718-23.460937 2.046874-34.8125l-12.632812-33.953125c-4.210938-11.339844-13.058594-20.457031-24.265625-25.011719-11.21875-4.558593-23.925781-4.195312-34.867187 1l-99.976563 47.480469c-4.941406-3.53125-10.984375-5.617188-17.507813-5.617188h-44.953124c-6.523438 0-12.570313 2.089844-17.511719 5.621094l-99.972657-47.488281c-10.941406-5.191406-23.648437-5.554687-34.867187-.996094-11.207031 4.554688-20.054687 13.671875-24.265625 25.007813l-12.632812 33.960937c-4.214844 11.347657-3.46875 24.035157 2.050781 34.808594.957031 1.871094 2.058593 3.660156 3.269531 5.355469h-41.691406c-4.363282 0-7.902344 3.535156-7.902344 7.902344v56.886718c0 4.363282 3.539062 7.902344 7.902344 7.902344 4.363281 0 7.902344-3.539062 7.902344-7.902344v-48.988281h54.886718c.878906.308594 1.769532.59375 2.671875.84375l66.339844 18.261719c-14.742187 22.589844-27.746094 46.351562-38.878906 70.972656h-85.019531v-9.484375c0-4.363281-3.539063-7.898437-7.902344-7.898437-4.363282 0-7.902344 3.535156-7.902344 7.898437v17.386719c0 4.363281 3.539062 7.902344 7.902344 7.902344h28.179687v279.753906c0 4.367187 3.539063 7.902344 7.902344 7.902344h424.03125c4.363281 0 7.902344-3.535157 7.902344-7.902344v-45.882813c0-4.363281-3.539063-7.902343-7.902344-7.902343-4.367187 0-7.902344 3.539062-7.902344 7.902343v37.984375h-156.707031v-266.996094c22.382812 42.394532 37.535156 88.492188 44.507812 136.121094.460938 3.152344 2.773438 5.71875 5.863282 6.507813.648437.167969 1.304687.246093 1.957031.246093 2.441406 0 4.792969-1.132812 6.308594-3.144531 11.359375-15.070312 21.921875-31.203125 31.457031-48.046875 15.96875 10.875 31.472656 23 46.183594 36.125 2.480468 2.210938 6.082031 2.636719 9.007812 1.058594 2.925782-1.574219 4.554688-4.8125 4.070313-8.101562-6.308594-43.035157-18.070313-85.355469-34.742188-125.625h42.089844v202.261718c0 4.367188 3.539063 7.902344 7.902344 7.902344 4.367187 0 7.902343-3.535156 7.902343-7.902344v-202.261718h28.183594c4.363282 0 7.898438-3.539063 7.898438-7.902344v-105.878906c.003906-4.367188-3.53125-7.902344-7.898438-7.902344zm-101.359375-83.859375c7.050781-3.34375 14.910157-3.570313 22.140625-.632813 7.21875 2.933594 12.6875 8.570313 15.402344 15.878906l12.628906 33.949219c2.71875 7.3125 2.253906 15.164063-1.300781 22.105469-3.550781 6.9375-9.648437 11.898438-17.164063 13.964844l-125.785156 34.628906v-37.976562c28.273438-17.3125 98.757813-53.019532 116.300782-28.257813 2.519531 3.558594 7.449218 4.40625 11.011718 1.882813 3.5625-2.523438 4.40625-7.457032 1.882813-11.015626-13.539063-19.113281-42.070313-20.042968-84.808594-2.757812-17.605469 7.117188-33.859375 15.804688-44.386719 21.832031v-5.832031c0-4.230469-.878906-8.261719-2.457031-11.921875zm-169.214843 43.390625h44.953124c7.929688 0 14.378907 6.453125 14.378907 14.378906v65.316406c0 7.929688-6.449219 14.378906-14.378907 14.378906h-44.953124c-7.929688 0-14.378907-6.449218-14.378907-14.378906v-65.316406c0-7.929688 6.449219-14.378906 14.378907-14.378906zm-13.28125 146.34375c7.558593-12.558594 15.785156-24.730469 24.636718-36.464844h22.234375c8.855469 11.734375 17.082031 23.90625 24.636719 36.464844zm-159.851563-118.433594c-3.554687-6.941406-4.019531-14.792969-1.304687-22.101562l12.636718-33.957032c2.710938-7.304687 8.179688-12.941406 15.398438-15.875 7.226562-2.9375 15.089844-2.710937 22.136718.632813l96.539063 45.855469c-1.578125 3.65625-2.457031 7.683593-2.457031 11.917968v6.28125c-10.492188-6.039062-27.113282-14.984375-45.167969-22.285156-42.734375-17.285156-71.269531-16.355469-84.808594 2.757812-2.523437 3.558594-1.679687 8.492188 1.882813 11.015626 3.5625 2.523437 8.492187 1.679687 11.011718-1.882813 17.707032-24.996094 89.351563 11.621094 117.082032 28.738281v37.496094l-125.78125-34.625c-7.519532-2.070312-13.617188-7.03125-17.167969-13.96875zm146.496094 65.960938c3.933593 7.359374 10.824219 12.910156 19.078125 15.046874-36.957032 51.5625-62.398438 110.808594-74.332032 173.082032-8.394531-12.265625-16.242187-25.121094-23.425781-38.398438-1.050781-1.945312-2.863281-3.359375-5.007812-3.902344-2.140625-.542968-4.410157-.164062-6.257813 1.042969-13.160156 8.582031-26.046875 17.996094-38.492187 28.105469 12.816406-67.273438 39.296875-132.140625 77.269531-189.0625zm-155 68.28125h42.09375c-16.671875 40.269531-28.433594 82.585937-34.746094 125.625-.480469 3.289062 1.144531 6.527343 4.070313 8.101562 2.929687 1.574219 6.527343 1.152344 9.007812-1.058594 14.710938-13.125 30.214844-25.25 46.1875-36.125 9.535156 16.84375 20.09375 32.972656 31.457031 48.046875 1.515625 2.011719 3.867188 3.148438 6.308594 3.148438.652344 0 1.308594-.082031 1.957031-.25 3.089844-.789063 5.398438-3.355469 5.859375-6.507813 6.976563-47.628906 22.128907-93.730468 44.507813-136.125v267h-156.703125zm172.507812 271.855468v-271.855468h63.210938v271.855468zm170.664063-193.265625c-1.847656-1.207031-4.121094-1.582031-6.257813-1.039062-2.140625.542969-3.957031 1.957031-5.007812 3.898437-7.183594 13.277344-15.03125 26.136719-23.425781 38.398438-11.933594-62.277344-37.375-121.519532-74.335938-173.078125 8.253906-2.132813 15.148438-7.6875 19.082031-15.050781l51.179688-14.089844c37.964843 56.933594 64.445312 121.800781 77.261719 189.066406-12.449219-10.109375-25.335938-19.523438-38.496094-28.105469zm101.136718-94.394531h-85.015624c-11.132813-24.621094-24.136719-48.382812-38.875-70.972656l66.332031-18.261719c.902343-.25 1.792969-.535156 2.671875-.84375h54.886718zm0 0"/></svg>
        </button>

        {/* Change it - Gift BCA */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg overflow-hidden w-80 p-6 shadow-lg">
              <div className="font-bold text-lg mb-4">SEND GIFT</div>
              <div className="mb-4">
                {/* Img SRC image BCA */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1200px-Bank_Central_Asia.svg.png" alt="" />
                {/* REK An BCA */}
                <h1 className='font-bold pt-3'>10109826 - AN WAHYU ZULFIRMAN</h1>
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setShowPopup(false)} 
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className='mt-10 mb-0'>
          <h2 className={`text-black text-center ${VollkornbBold.className} text-2xl mb-4`}>All Wishes and Friends</h2>
          <div className='space-y-4'>
            {comments.length > 0 ? (
              <div className='overflow-y-scroll h-80 space-y-4'>
                {comments.map((comment) => (
                  <div key={comment.id} className='p-4 bg-white border border-gray-300 rounded-md'>
                    <p className='font-bold'>{comment.name}</p>
                    <p>{comment.message}</p>
                    <p className='text-sm text-gray-500'>{formatTimestamp(comment.timestamp)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No comments available</p>
            )}
          </div>
        </div>

      </div>
    
      <img src={FlowerBawah.src} alt='Bunga Bawah' className='w-full h-auto flower animate-flower xl:w-[600px]  bottom-0 left-0' />
    </div>

      <div className='relative text-center h-screen bg-cover bg-center' style={{ backgroundImage: `url(${WeddingImage3.src})`, backgroundSize: 'cover' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className='absolute top-0 left-0 w-full z-20'>
              <path fill="WHITE" fillOpacity="1" d="M0,128L34.3,128C68.6,128,137,128,206,122.7C274.3,117,343,107,411,106.7C480,107,549,117,617,133.3C685.7,149,754,171,823,186.7C891.4,203,960,213,1029,213.3C1097.1,213,1166,203,1234,197.3C1302.9,192,1371,192,1406,192L1440,192L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path>
          </svg>
          <div className='absolute inset-0 bg-black opacity-80 z-10'></div>
          <div className='relative z-20 flex flex-col items-center justify-center h-full px-10'>
              <h1 className={`${SignikaFont.className} font-bold text-white xl:text-xl`}>Cinta adalah kekuatan yang membawa dua jiwa menjadi satu, mewujudkan kebahagiaan yang tak terhingga dalam kesederhanaan kebersamaan.</h1>
              <div className='absolute bottom-10 flex flex-col items-center'>
                  <h1 className={`text-white mb-2 ${PoppinsBold.className} xl:text-xl`}>Love, from</h1>
                  <svg className="pulse-animation" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <h1 className={`text-white ${LoraFont.className} text-2xl`}>Nafa & Wahyu</h1>
              </div>
          </div>
      </div>
      

      {/* Footer */}
      <div 
        onClick={togglePlayPause} 
        className="record z-50"
      >
        <div className="record-center">
          {isPlaying ? <FaPause className="icon" /> : <FaPlay className="icon" />}
        </div>
      </div>
      </>
      )}
      
    </div>
  );
}
