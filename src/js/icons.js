const ICONS = {
  'flagw': {
    normal: '../images/flagw.png',
    active: '../images/flagw-select.png'
  },
  'house': {
    normal: '../images/house.png',
    active: '../images/house-select.png'
  },
  'peace': {
    normal: '../images/peace.png',
    active: '../images/peace-select.png'
  },
  'sfb': {
    normal: '../images/sfb.png',
    active: '../images/sfb-select.png'
  },
  'theater': {
    normal: '../images/theater.png',
    active: '../images/theater-select.png'
  },
  'info': {
    normal: '../images/info.png',
    active: '../images/info-select.png'
  },
  'shakehand': {
    normal: '../images/shakehand.png',
    active: '../images/shakehand-select.png'
  },
  'camp': {
    normal: '../images/camp.png',
    active: '../images/camp-select.png'
  },
  'strike': {
    normal: '../images/strike.png',
    active: '../images/strike-select.png'
  },
  'meet': {
    normal: '../images/meet.png',
    active: '../images/meet-select.png'
  },
  'sfbmeet': {
    normal: '../images/sfbmeet.png',
    active: '../images/sfbmeet-select.png'
  },
  'sfbmeet2': {
    normal: '../images/sfbmeet2.png',
    active: '../images/sfbmeet2-select.png'
  },
  'grave': {
    normal: '../images/grave.png',
    active: '../images/grave-select.png'
  },
  'lecture': {
    normal: '../images/lecture.png',
    active: '../images/lecture-select.png'
  },
  'construct': {
    normal: '../images/construct.png',
    active: '../images/construct-select.png'
  },
  'metal': {
    normal: '../images/metal.png',
    active: '../images/metal-select.png'
  },
  'seed': {
    normal: '../images/seed.png',
    active: '../images/seed-select.png'
  },
  'farm2': {
    normal: '../images/farm2.png',
    active: '../images/farm2-select.png'
  },
  'farm1': {
    normal: '../images/farm1.png',
    active: '../images/farm1-select.png'
  },
  'prison': {
  	normal: '../images/prison.png',
	  active: '../images/prison-select.png'
  },	
  'circus': {
    normal: '../images/circus.png',
    active: '../images/circus-select.png'
  },
  'bakuninh': {
    normal: '../images/bakuninh.png',
    active: '../images/bakuninh-select.png'
  },
  'home': {
    normal: '../images/home.png',
    active: '../images/home-select.png'
  },
  'sfbhome': {
    normal: '../images/sfbhome.png',
    active: '../images/sfbhome-select.png'
  },
  'music': {
    normal: '../images/music.png',
    active: '../images/music-select.png'
  },
  'medicine': {
    normal: '../images/medicine.png',
    active: '../images/medicine-select.png'
  },
  'protest': {
    normal: '../images/revolt.png',
    active: '../images/revolt-select.png'
  }
};

export class Icons {
  constructor (preLoader) {
    this.preLoader = preLoader;
    for (const icon of Object.values(ICONS)) {
      preLoader.add(icon.normal);
      preLoader.add(icon.active);
    }
  }

  get (name, active = false) {
    return this.preLoader.get(ICONS[name][active ? 'active' : 'normal']);
  }
}
