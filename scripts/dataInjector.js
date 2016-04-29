function queryToObject( /*String*/ str) {
  var dec = decodeURIComponent,
    qp = str.split("&"),
    ret = {},
    name, val;
  for (var i = 0, l = qp.length, item; i < l; ++i) {
    item = qp[i];
    if (item.length) {
      var s = item.indexOf("=");
      if (s < 0) {
        name = dec(item);
        val = "";
      } else {
        name = dec(item.slice(0, s));
        val = dec(item.slice(s + 1));
      }
      if (typeof ret[name] == "string") { // inline'd type check
        ret[name] = [ret[name]];
      }

      if (Array.isArray(ret[name])) {
        ret[name].push(val);
      } else {
        ret[name] = val;
      }
    }
  }
  return ret; // Object
};

function parseString2Boolean(config) {
  config.isFeaturesSectionVisible = JSON.parse(config.isFeaturesSectionVisible);
  config.isAboutSectionVisible = JSON.parse(config.isAboutSectionVisible);
  config.isExploreSectionVisible = JSON.parse(config.isExploreSectionVisible);
  config.isConnectSectionVisible = JSON.parse(config.isConnectSectionVisible);
};

function checkHtml(htmlStr) {
  var  reg = /<[^>]+>/g;
  return reg.test(htmlStr);
}

var dataInjector = function(configObj) {
  parseString2Boolean(configObj);

  var loadMenuItems = function() {
    document.getElementById('intro-section-item').innerHTML = configObj.introSectionName;
    document.getElementById('features-section-item').innerHTML = configObj.featuresSectionName;
    document.getElementById('about-section-item').innerHTML = configObj.aboutSectionName;
    document.getElementById('explore-section-item').innerHTML = configObj.exploreSectionName;
    document.getElementById('connect-section-item').innerHTML = configObj.connectSectionName;
  };

  var loadSectionNames = function() {
    var featuresSectionName = document.getElementById('features-section-name');
    if (configObj.isFeaturesSectionVisible) {
      featuresSectionName.innerHTML = configObj.featuresSectionName;
    } else if (!configObj.isFeaturesSectionVisible) {
      featuresSectionName.innerHTML = configObj.featuresSectionName + ' (invisible)';
    }
    var aboutSectionName = document.getElementById('about-section-name');
    if (configObj.isAboutSectionVisible) {
      aboutSectionName.innerHTML = configObj.aboutSectionName;
    } else if (!configObj.isAboutSectionVisible) {
      aboutSectionName.innerHTML = configObj.aboutSectionName + ' (invisible)';
    }
    var exploreSectionName = document.getElementById('explore-section-name');
    if (configObj.isExploreSectionVisible) {
      exploreSectionName.innerHTML = configObj.exploreSectionName;
    } else if (!configObj.isExploreSectionVisible) {
      exploreSectionName.innerHTML = configObj.exploreSectionName + ' (invisible)';
    }
    var connectSectionName = document.getElementById('connect-section-name');
    if (configObj.isConnectSectionVisible) {
      connectSectionName.innerHTML = configObj.connectSectionName;
    } else if (!configObj.isConnectSectionVisible) {
      connectSectionName.innerHTML = configObj.connectSectionName + ' (invisible)';
    }
  };

  /* HEADER FUNCTIONS */

  var changeTitle = function() {
    document.title = configObj.title;
  };


  /* TITLE PAGE FUNCTIONS */

  var buildPlatformButtonHtml = function(elementId, url, icon, title, cssClass) {
    var html = '';

    if (!cssClass) {
      cssClass = "";
    }

    // give it its id and href
    html += '<a id="' + elementId + '" href="' + url + '" class="button title-button ' + cssClass + '" target="_blank">';

    // url
    html += '<img src="assets/icons/' + icon + '">';

    // title
    html += '<span>' + title + '</span>';

    html += '</a>';

    return html;
  };

  var ua = navigator.userAgent;
  var isAndroid = /Android/i.test(ua);

  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var isMac = /Macintosh/i.test(ua);
  var isWindows = /Windows/i.test(ua);

  var injectPlatformLinks = function() {
    var buttonsUrl = '';

    if (configObj.androidLink) {
      if (!isAndroid) {
        //configObj.androidLink = "#"
      } else {
        var androidversion = parseFloat(ua.slice(ua.indexOf("Android") + 8));
        if (androidversion && androidversion < 4.2) {
          setTimeout('alert("Sorry your version of Android is not supported. This apps works best on Jelly Bean (4.2+) and above.")', 1500);
        }
      }
      buttonsUrl += buildPlatformButtonHtml('android-link', configObj.androidLink, 'android.png', 'Android' /*, isAndroid? "":"fade"*/ );
    }
    if (configObj.iosLink) {
      if (!isIOS) {
        //configObj.iosLink = "#"
      }
      buttonsUrl += buildPlatformButtonHtml('ios-link', configObj.iosLink, 'apple.png', 'iOS' /*, isIOS? "": "fade"*/ );
    }
    if (configObj.linux64Link) {
      buttonsUrl += buildPlatformButtonHtml('linux-64-link', configObj.linux64Link, 'linux.png', 'Linux64' /*, isLinux? "" : "fade"*/ );
    }
    // if(configObj.webAppLink) {
    //   buttonsUrl += buildPlatformButtonHtml('web-app-link', configObj.webAppLink, 'web.png', 'Web',"");
    // }
    if (configObj.windows32Link && !isIOS && !isAndroid) {
      // if (!isWindows) {
      //   configObj.windows32Link = "#";
      // }
      buttonsUrl += buildPlatformButtonHtml('windows-32-link', configObj.windows32Link, 'windows.png', 'Windows32' /*, isWindows? "": "fade"*/ );
    }
    if (configObj.windows64Link && !isIOS && !isAndroid) {
      // if (!isWindows) {
      //   configObj.windows64Link = "#";
      // }
      buttonsUrl += buildPlatformButtonHtml('windows-64-link', configObj.windows64Link, 'windows.png', 'Windows64' /*, isWindows? "": "fade"*/ );
    }
    if (configObj.macOSLink && !isAndroid) {
      // if (!isMac) {
      //   configObj.macOSLink = "#";
      // }
      buttonsUrl += buildPlatformButtonHtml('mac-os-link', configObj.macOSLink, 'apple.png', 'Mac' /*, isMac?"":"fade"*/ );
    }

    //buttonsUrl += "<span class='button title-button fade'><img src='assets/icons/apple.png'> coming soon</span>"

    document.getElementById('platform-buttons').innerHTML = buttonsUrl;
  };

  var getPhoneShim = function() {
    if (configObj.shimOrientation === 'landscape') {
      $('#app-image-container').addClass('iphone-landscape');
      document.getElementById('shim-container').src = 'assets/shim/iphonelandscape.png';
      $('#shim').addClass('iphone-landscape');
    } else {
      $('#app-image-container').addClass('iphone-portrait');
      document.getElementById('shim-container').src = 'assets/shim/iphoneportrait.png';
      $('#shim').addClass('iphone-portrait');
    }
  };

  var getTabletShim = function() {
    if (configObj.shimOrientation === 'landscape') {
      $('#app-image-container').addClass('ipad-landscape');
      document.getElementById('shim-container').src = 'assets/shim/ipadlandscape.png';
      $('#shim').addClass('ipad-landscape');
    } else {
      $('#app-image-container').addClass('ipad-portrait');
      document.getElementById('shim-container').src = 'assets/shim/ipadportrait.png';
      $('#shim').addClass('ipad-portrait');
    }
  };

  var getLaptopShim = function() {
    $('#app-image-container').addClass('laptop');
    document.getElementById('shim-container').src = 'assets/shim/laptop.png';
    $('#shim').addClass('laptop');
  };

  var getDesktopShim = function() {
    $('#app-image-container').addClass('desktop');
    document.getElementById('shim-container').src = 'assets/shim/desktop.png';
    $('#shim').addClass('desktop');
  };

  var getShim = function() {
    switch (configObj.shimDevice) {
      case 'phone':
        getPhoneShim();
        break;
      case 'tablet':
        getTabletShim();
        break;
      case 'laptop':
        getLaptopShim();
        break;
      case 'desktop':
        getDesktopShim();
      default:
        break;
    }
  };

  var injectTitlePage = function() {
    document.getElementById('title').innerHTML = configObj.title;
    document.getElementById('subtitle').innerHTML = configObj.subtitle;
    document.getElementById('author').innerHTML = 'By ' + configObj.author;
    document.getElementById('app-icon').src = configObj.appIcon;
    document.getElementById('home-section').style.backgroundImage = "url(" + configObj.mainBackground + ")";
    document.getElementById('shim').src = configObj.featuredScreenshot;

    getShim();
    injectPlatformLinks();
  };



  /* FEATURED PAGE FUNCTIONS */



  var injectFeaturedPoints = function() {
    var featuresHtml = '';

    configObj.features.forEach(function(feature) {
      var featureTag = '<li class="column-list-item">' +
        '<img class="list-img" src="assets/icons/dot.png">' +
        '<span class="description">' + feature + '</span>' +
        '</li>';
      featuresHtml += featureTag;
    });

    document.getElementById('featured-points').innerHTML = featuresHtml;
  };

  var injectCarouselScreenshots = function() {
    var screenshotHtml = '';

    configObj.screenshots.forEach(function(screenshot) {
      var carouselItem = '<li>' +
        '<img src="' + screenshot + '">' +
        '</li>';
      screenshotHtml += carouselItem;
    });

    document.getElementById('screenshots-carousel').innerHTML = screenshotHtml;
  };

  var injectFeatures = function() {
    document.getElementById('features-blurb').innerHTML = configObj.featuresBlurb;

    injectFeaturedPoints();
    injectCarouselScreenshots();
  };



  /* ABOUT PAGE FUNCTIONS */
  var injectAbout = function() {
    document.getElementById('about-paragraph').innerHTML = configObj.aboutParagraph;
    if(checkHtml(configObj.aboutParagraph))
      document.getElementById('about-paragraph').style.textAlign="left";
    document.getElementById('about-contact-us').innerHTML = configObj.contactUs;
    // document.getElementById('contact-information').innerHTML = configObj.organizationName + ' &bull; ' + configObj.organizationCityAndState +
    //                                ' &bull; ' + configObj.organizationWebsite;
    document.getElementById('contact-information').innerHTML = configObj.contactContent;
  };

  /* CONNECT PAGE FUNCTIONS */
  var buildSocialLinksHtml = function(url, imgLink, title) {

    var socialLinkHtml = '<li class="column-list-item share-item">' +
      '<a href="' + url + '" class="column-list-item-link" target="_blank">' +
      '<img class="list-img share-img" src="' + imgLink + '">' +
      '<span class="subtitle">' + title + '</span>' +
      '</a>' +
      '</li>';

    return socialLinkHtml;
  };

  var injectSocials = function() {

    if (configObj.showCommunity && configObj.showCommunity == "no") return;
    var socialLinksHtml = '';

    if (configObj.twitterLink) {
      socialLinksHtml += buildSocialLinksHtml(
        configObj.twitterLink,
        'assets/icons/twitterdark.png',
        configObj.twitterLinkLabel || 'Follow our tweets');
    }
    if (configObj.facebookLink) {
      socialLinksHtml += buildSocialLinksHtml(
        configObj.facebookLink,
        'assets/icons/facebookdark.png',
        configObj.facebookLinkLabel || 'See our posts');
    }
    if (configObj.blogLink) {
      socialLinksHtml += buildSocialLinksHtml(
        configObj.blogLink,
        'assets/icons/blogdark.png',
        configObj.blogLinkLabel || 'Read our blog');
    }
    if (configObj.websiteLink) {
      socialLinksHtml += buildSocialLinksHtml(
        configObj.websiteLink,
        'assets/icons/webdark.png',
        configObj.websiteLinkLabel || 'Visit our site');
    }

    document.getElementById('social-links').innerHTML = socialLinksHtml;
  };



  /* MEDIA LOADING FUNCTIONS */
  var loadVideo = function() {
    document.getElementById('video-introduction').innerHTML = configObj.videoIntroduction;
    document.getElementById('video-container').src = configObj.videoUrl;
  };

  var loadMedia = function() {
    if (configObj.videoUrl) setTimeout(loadVideo, 500);
  };


  var initalizeFullPage = function(hash) {
    // var sections = ['intro', 'features', 'about', 'explore', 'connect'];
    // var sectionsWithoutVideo = ['intro', 'features', 'about', 'connect'];
    var sections = ['intro'];
    if (window.runInPreview) {
      sections = ['intro', 'features', 'about', 'explore', 'connect'];
    } else {
      var fullPageElement = document.getElementById('fullpage');
      var menuElement = document.getElementById('menu');
      if (configObj.isFeaturesSectionVisible) {
        sections.push('features');
      } else {
        var featuresSection = document.getElementById('features-section');
        var featuresMenuItem = document.getElementById('features-menu-item');
        fullPageElement.removeChild(featuresSection);
        menuElement.removeChild(featuresMenuItem);
      }
      if (configObj.isAboutSectionVisible) {
        sections.push('about');
      } else {
        var aboutSection = document.getElementById('about-section');
        var aboutMenuItem = document.getElementById('about-menu-item');
        fullPageElement.removeChild(aboutSection);
        menuElement.removeChild(aboutMenuItem);
      }
      if (configObj.isExploreSectionVisible) {
        sections.push('explore');
      } else {
        var exploreSection = document.getElementById('explore-section');
        var exploreMenuItem = document.getElementById('explore-menu-item');
        fullPageElement.removeChild(exploreSection);
        menuElement.removeChild(exploreMenuItem);
      }
      if (configObj.isConnectSectionVisible) {
        sections.push('connect');
      } else {
        var connectSection = document.getElementById('connect-section');
        var connectMenuItem = document.getElementById('connect-menu-item');
        fullPageElement.removeChild(connectSection);
        menuElement.removeChild(connectMenuItem);
      }
    }

    $('#fullpage').fullpage({
      sectionsColor: ['#FFF', '#EEE', '#FFF', '#EEE', '#FFF', '#EEE'],
      anchors: sections,
      menu: '#menu',
      scrollOverflow: true,
      paddingTop: '35px',
      css3: true,
      navigation: true
    });
    if(hash!='#intro')
      $('#fullpage').fullpage.moveTo(hash.substr(1));
  };


  /* MAIN METHOD */

  var injectData = function(hash) {
    loadMenuItems();

    changeTitle();

    injectTitlePage();
    injectFeatures();
    injectAbout();
    injectSocials();

    loadMedia();

    loadSectionNames();

    initalizeFullPage(hash);
  };



  // bundle up the public functions and objects

  var that = {};

  that.injectData = injectData;

  return that;
};