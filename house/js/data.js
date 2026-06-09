const houseConfig = {
    audio: {
        intro: "assets/audio/intro.mp3",
        outside: "assets/audio/premonition.mp3",
        victory: "assets/audio/victory.wav",
        squeak: "assets/audio/squeak.mp3"
    }
};

window.houseConfig = houseConfig;

window.roomContent = {
    hall: {
        title: "The Reception Hall",
        title_nl: "De Ontvangsthal",

        hex: 0x197654,
        playlist: [
            {
                track: "The House of Awe",
                src: "assets/audio/TheHouseofAwe.mp3",
                lyrics: [
                    { time: 1.00, text: "\u2014", text_nl: "\u2014" },
                    { time: 10.52, text: "The Rolls Royce sits", text_nl: "De Rolls Royce staat stil" },
                    { time: 14.40, text: "The Fiat engine whines", text_nl: "De Fiat-motor jankt" },
                    { time: 21.09, text: "Big dreams", text_nl: "Grote dromen" },
                    { time: 23.58, text: "Small battery", text_nl: "Kleine accu" },
                    { time: 26.14, text: "", text_nl: "" },
                    { time: 26.57, text: "The screen drinks", text_nl: "Het scherm drinkt" },
                    { time: 28.81, text: "The man thins", text_nl: "De man wordt mager" },
                    { time: 30.65, text: "", text_nl: "" },
                    { time: 31.15, text: "Used to be \"Awe\"", text_nl: "Vroeger was het verbazing" },
                    { time: 36.07, text: "Now it\u2019s a sigh...", text_nl: "Nu is het een zucht..." },
                    { time: 40.95, text: "", text_nl: "" },
                    { time: 41.42, text: "Welcome to the House...", text_nl: "Welkom in het Huis..." },
                    { time: 46.30, text: "...the House of \"Aaaah\"", text_nl: "...het Huis van 'Aaaah'" },
                    { time: 53.26, text: "", text_nl: "" },
                    { time: 63.73, text: "A father in the room", text_nl: "Een vader in de kamer" },
                    { time: 66.40, text: "A ghost on the map", text_nl: "Een geest op de kaart" },
                    { time: 68.97, text: "Eyes on the glass", text_nl: "Ogen op het glas" },
                    { time: 71.35, text: "Dopamine on tap", text_nl: "Dopamine uit de kraan" },
                    { time: 75.00, text: "", text_nl: "" },
                    { time: 88.30, text: "Infinite tools", text_nl: "Oneindig veel gereedschap" },
                    { time: 90.69, text: "Finite man", text_nl: "De eindige mens" },
                    { time: 92.78, text: "", text_nl: "" },
                    { time: 94.33, text: "Landing on feet...", text_nl: "Landen op je voeten..." },
                    { time: 99.67, text: "Life out of reach...", text_nl: "Het leven buiten bereik..." },
                    { time: 103.57, text: "", text_nl: "" },
                    { time: 104.74, text: "Wherever I can...", text_nl: "Waar ik maar kan..." },
                    { time: 109.37, text: "On a digital beach.", text_nl: "Op een digitaal strand." },
                    { time: 114.01, text: "", text_nl: "" },
                    { time: 121.02, text: "Are you still in there?", text_nl: "Ben je er nog?" }
                ]
            }
        ]
    },

    living: {
        title: "The Living Room",
        title_nl: "De Woonkamer",

        hex: 0xe65100,
        playlist: [
            { track: "Hope", src: "assets/audio/Hope.mp3" }
        ],
        videoPlaylist: [
            { title: "The Premonition", src: "assets/video/premonition.mp4" },
            { title: "The History of Mankind", src: "assets/video/historytrailer.mp4" },
            { title: "LIFE or DREAM?", src: "assets/video/life-or-dream.mp4" }
        ],
        videoInterfacePos: { x: 3.0, y: 3.2, z: -4.9 },
        tvImages: [
            { image: "assets/images/tv.jpg", color: "#000", text: "" }
        ]
    },

    studio: {
        title: "The Studio",
        title_nl: "De Studio",

        hex: 0x212351,
        playlist: [
            { track: "Heartroll", src: "assets/audio/Heartroll.mp3" }
        ]
    },

    bedroom: {
        title: "The Bedroom",
        title_nl: "De Slaapkamer",

        hex: 0x004d40,
        playlist: [
            { track: "Dreaming", src: "assets/audio/sleepy.mp3" },
            { track: "Prepare", src: "assets/audio/prepare.mp3" },
            { track: "Bells", src: "assets/audio/bells.mp3" }
        ],
        videoPlaylist: [
            { title: "Night After Night", src: "assets/video/nain.mp4", volume: 0.4 },
            { title: "The Spirit", src: "assets/video/spirit.mp4" },
            { title: "Dreaming", src: "assets/video/dreaming.mp4" }
        ],
        musicInterfacePos: { y: 4.2 }
    },

    attic: {
        title: "The Attic",
        title_nl: "De Zolder",

        hex: 0x5d4037,
        playlist: [
            { track: "Curiosity", src: "assets/audio/Curiosity.mp3" },
            { track: "Symbiosis", src: "assets/audio/symbiosis.mp3" }
        ]
    },

    bathroom: {
        title: "The Bathroom",
        title_nl: "De Badkamer",

        hex: 0x0696a4,
        playlist: [
            { track: "Glass Garden Waltz", src: "assets/audio/GlassGardenWaltz.mp3" }
        ],
        videoPlaylist: [
            { title: "Time Is Now", src: "assets/video/Time-Is-Now.mp4" }
        ],
        videoInterfacePos: { x: 2.8, y: 2.8, z: -4.92 },
        musicInterfacePos: { y: 2.8 }
    },

    toilet: {
        title: "The Little Room",
        title_nl: "Het kleinste kamertje",

        hex: 0x046896,
        interiorWidth: 3.0,
        interiorDepth: 5.0,
        playlist: [
            { track: "Mysterious Heartbeat 1", src: "assets/audio/MysteriousHeartbeat1.mp3" },
            { track: "Mysterious Heartbeat 2", src: "assets/audio/MysteriousHeartbeat2.mp3" }
        ]
    },

    basement: {
        title: "The Basement",
        title_nl: "De Kelder",

        hex: 0x334155,
        playlist: [
            { track: "Seven is calling", src: "assets/audio/Seven.mp3" }
        ]
    },

    annex: {
        title: "The Hidden Annex",
        title_nl: "De verborgen kamer",

        hex: 0x1a1a1a,
        interiorWidth: 4,
        interiorDepth: 4,
        playlist: [
            { track: "Free Will", src: "assets/audio/Free_Will.mp3" },
            { track: "Life's Lament", src: "assets/audio/Lifes_Lament.mp3" }
        ]
    },

    space: {
        title: "The Void",
        title_nl: "De Leegte",

        hex: 0x000000,
        playlist: [
            { track: "No More Pain", src: "assets/audio/Nomorepain.mp3" }
        ]
    }
};
