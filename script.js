// ========================================
// TASK 0: jQuery Setup
// ========================================
$(document).ready(function(){
  console.log("jQuery is ready!");
  
  // Initialize all jQuery functions
  initDateTime();
  initBackgroundColorChanger();
  initFormValidation();
  initAccordion();
  initPopupSubscription();
  initRealTimeSearch();
  initAutocomplete();
  initSearchHighlight();
  initScrollProgressBar();
  initAnimatedCounter();
  initLoadingSpinner();
  initNotificationSystem();
  initCopyToClipboard();
  initLazyLoading();
});

// ========================================
// TASK 5: Display Current Date and Time
// ========================================
function initDateTime() {
  function updateDateTime() {
    const now = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const formattedDate = now.toLocaleString('en-US', options);
    $('#current-datetime').text(formattedDate);
  }
  
  if ($('#current-datetime').length) {
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }
}

// ========================================
// TASK 4: Change Background Color
// ========================================
function initBackgroundColorChanger() {
  const colors = ['#f5f5f0', '#e8f4f8', '#fff5e6', '#f0e6ff', '#e6ffe6', '#ffe6f0', '#fff9e6'];
  
  $('#bg-color-btn').on('click', function() {
    const currentColor = $('body').css('background-color');
    let newColor;
    do {
      newColor = colors[Math.floor(Math.random() * colors.length)];
    } while (newColor === currentColor);
    
    $('body').css({'background-color': newColor, 'transition': 'background-color 0.5s ease'});
  });
}

// ========================================
// TASK 1: Form Validation
// ========================================
function initFormValidation() {
  const reservationForm = $('#booking-header').siblings('.about-content').next('.contact-form');
  
  reservationForm.on('submit', function(e) {
    e.preventDefault();
    $('.error-message').remove();
    $('input, select, textarea').css('border-color', '');
    let isValid = true;
    
    const name = $('#guest-name');
    if (!name.val().trim() || name.val().trim().length < 2) {
      showError(name, 'Name must be at least 2 characters long');
      isValid = false;
    }
    
    const email = $('#guest-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.val().trim() || !emailRegex.test(email.val())) {
      showError(email, 'Please enter a valid email address');
      isValid = false;
    }
    
    const phone = $('#guest-phone');
    const phoneDigits = phone.val().replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 10) {
      showError(phone, 'Phone number must be at least 10 digits');
      isValid = false;
    }
    
    const partySize = $('#party-size');
    if (!partySize.val()) {
      showError(partySize, 'Please select party size');
      isValid = false;
    }
    
    const date = $('#reservation-date');
    if (!date.val()) {
      showError(date, 'Please select a date');
      isValid = false;
    } else {
      const selectedDate = new Date(date.val());
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        showError(date, 'Date cannot be in the past');
        isValid = false;
      }
    }
    
    const time = $('#reservation-time');
    if (!time.val()) {
      showError(time, 'Please select a time');
      isValid = false;
    }
    
    if (isValid) {
      showNotification('Reservation submitted successfully! We will contact you shortly to confirm.', 'success');
      this.reset();
    }
  });
  
  function showError(element, message) {
    const errorDiv = $('<div class="error-message"></div>').text(message);
    element.css('border-color', '#d32f2f');
    element.parent().append(errorDiv);
    element.one('input', function() {
      $(this).css('border-color', '');
      $(this).parent().find('.error-message').remove();
    });
  }
}

// ========================================
// TASK 2: Accordion for FAQs
// ========================================
function initAccordion() {
  $('.accordion-header').on('click', function() {
    const item = $(this).parent();
    const content = item.find('.accordion-content');
    const isActive = item.hasClass('active');
    
    $('.accordion-item').removeClass('active');
    $('.accordion-content').css('max-height', '');
    
    if (!isActive) {
      item.addClass('active');
      content.css('max-height', content.prop('scrollHeight') + 'px');
    }
  });
}

// ========================================
// TASK 3: Popup Subscription Form
// ========================================
function initPopupSubscription() {
  function openPopup() {
    $('#subscription-popup').css('display', 'flex');
    $('body').css('overflow', 'hidden');
  }
  
  function closePopup() {
    $('#subscription-popup').css('display', 'none');
    $('body').css('overflow', '');
  }
  
  $('#subscribe-btn').on('click', openPopup);
  $('#close-popup').on('click', closePopup);
  
  $('#subscription-popup').on('click', function(e) {
    if (e.target === this) closePopup();
  });
  
  $('#subscription-form').on('submit', function(e) {
    e.preventDefault();
    const email = $('#popup-email').val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    showNotification('Thank you for subscribing! You will receive our newsletter soon.', 'success');
    $('#popup-email').val('');
    closePopup();
  });
}

// ========================================
// PART 1 - TASK 1: Real-time Search
// ========================================
function initRealTimeSearch() {
  if ($('#menu-header').length) {
    const searchBar = $('<div class="search-container"><input type="text" id="menu-search" placeholder="Search menu items..." class="search-input"></div>');
    $('#menu-header').after(searchBar);
    
    $('#menu-search').on('keyup', function() {
      const searchTerm = $(this).val().toLowerCase();
      $('.menu-item').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(searchTerm) > -1);
      });
      $('.menu-section').each(function() {
        $(this).toggle($(this).find('.menu-item:visible').length > 0);
      });
    });
  }
  
  if ($('#gallery-header').length) {
    const searchBar = $('<div class="search-container"><input type="text" id="gallery-search" placeholder="Search gallery..." class="search-input"></div>');
    $('.about-content').first().after(searchBar);
    
    $('#gallery-search').on('keyup', function() {
      const searchTerm = $(this).val().toLowerCase();
      $('.gallery-item').filter(function() {
        $(this).toggle($(this).find('.caption').text().toLowerCase().indexOf(searchTerm) > -1);
      });
    });
  }
}

// ========================================
// PART 1 - TASK 2: Autocomplete
// ========================================
function initAutocomplete() {
  if ($('#menu-search').length) {
    const suggestions = [];
    $('.menu-item h3').each(function() {
      suggestions.push($(this).text());
    });
    
    const suggestionBox = $('<div id="autocomplete-suggestions" class="autocomplete-box"></div>');
    $('#menu-search').after(suggestionBox);
    
    $('#menu-search').on('input', function() {
      const searchTerm = $(this).val().toLowerCase();
      suggestionBox.empty();
      
      if (searchTerm.length > 0) {
        const matches = suggestions.filter(item => item.toLowerCase().includes(searchTerm)).slice(0, 5);
        
        if (matches.length > 0) {
          matches.forEach(match => {
            const div = $('<div class="autocomplete-item"></div>').text(match);
            div.on('click', function() {
              $('#menu-search').val(match).trigger('keyup');
              suggestionBox.empty();
            });
            suggestionBox.append(div);
          });
          suggestionBox.show();
        } else {
          suggestionBox.hide();
        }
      } else {
        suggestionBox.hide();
      }
    });
    
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.search-container').length) suggestionBox.hide();
    });
  }
}

// ========================================
// PART 1 - TASK 3: Search Highlighting
// ========================================
function initSearchHighlight() {
  if ($('.accordion').length) {
    const highlightSearch = $('<div class="search-container"><input type="text" id="highlight-search" placeholder="Search and highlight in FAQs..." class="search-input"><button id="clear-highlight" class="button-style" style="margin-left: 10px;">Clear</button></div>');
    $('.accordion').before(highlightSearch);
    
    $('#highlight-search').on('keyup', function() {
      const searchTerm = $(this).val();
      
      $('.accordion-content p').each(function() {
        const content = $(this).html().replace(/<mark class="highlight">(.*?)<\/mark>/g, '$1');
        $(this).html(content);
      });
      
      if (searchTerm.length > 2) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        $('.accordion-content p').each(function() {
          const originalText = $(this).text();
          const highlightedText = originalText.replace(regex, '<mark class="highlight">$1</mark>');
          $(this).html(highlightedText);
        });
      }
    });
    
    $('#clear-highlight').on('click', function() {
      $('#highlight-search').val('').trigger('keyup');
    });
  }
}

// ========================================
// PART 2 - TASK 4: Scroll Progress Bar
// ========================================
function initScrollProgressBar() {
  const progressBar = $('<div id="scroll-progress-bar"></div>');
  $('body').prepend(progressBar);
  
  $(window).on('scroll', function() {
    const scrollPercent = ($(window).scrollTop() / ($(document).height() - $(window).height())) * 100;
    $('#scroll-progress-bar').css('width', scrollPercent + '%');
  });
}

// ========================================
// PART 2 - TASK 5: Animated Counter
// ========================================
function initAnimatedCounter() {
  if ($('#top-banner').length) {
    const statsSection = $(`
      <section class="stats-section">
        <h2>Our Achievements</h2>
        <div class="stats-container">
          <div class="stat-item"><span class="stat-number" data-target="1000">0</span><p>Happy Customers</p></div>
          <div class="stat-item"><span class="stat-number" data-target="50">0</span><p>Menu Items</p></div>
          <div class="stat-item"><span class="stat-number" data-target="15">0</span><p>Years Experience</p></div>
          <div class="stat-item"><span class="stat-number" data-target="500">0</span><p>Daily Visitors</p></div>
        </div>
      </section>
    `);
    
    $('.bg-color-section').after(statsSection);
    let animated = false;
    
    $(window).on('scroll', function() {
      const statsOffset = $('.stats-section').offset();
      if (statsOffset && $(window).scrollTop() + $(window).height() > statsOffset.top && !animated) {
        animated = true;
        $('.stat-number').each(function() {
          const target = parseInt($(this).data('target'));
          const element = $(this);
          let current = 0;
          const increment = target / 100;
          
          const counter = setInterval(function() {
            current += increment;
            if (current >= target) {
              element.text(target + '+');
              clearInterval(counter);
            } else {
              element.text(Math.floor(current) + '+');
            }
          }, 20);
        });
      }
    });
  }
}

// ========================================
// PART 2 - TASK 6: Loading Spinner
// ========================================
function initLoadingSpinner() {
  $('.contact-form').on('submit', function(e) {
    e.preventDefault();
    const submitBtn = $(this).find('.submit-btn, button[type="submit"]');
    const originalText = submitBtn.text();
    
    submitBtn.prop('disabled', true).html('<span class="spinner"></span> Please wait...').addClass('loading');
    
    setTimeout(function() {
      submitBtn.prop('disabled', false).text(originalText).removeClass('loading');
      showNotification('Message sent successfully!', 'success');
    }, 2000);
  });
}

// ========================================
// PART 3 - TASK 7: Notification System
// ========================================
function showNotification(message, type = 'info') {
  const notification = $(`
    <div class="notification ${type}">
      <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span class="notification-message">${message}</span>
    </div>
  `);
  
  $('body').append(notification);
  setTimeout(() => notification.addClass('show'), 100);
  setTimeout(() => {
    notification.removeClass('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function initNotificationSystem() {
  $('.card button').on('click', function() {
    showNotification('Feature coming soon!', 'info');
  });
  
  $('.menu-item').on('click', function() {
    const itemName = $(this).find('h3').text();
    showNotification(`${itemName} details viewed!`, 'success');
  });
}

// ========================================
// PART 3 - TASK 8: Copy to Clipboard
// ========================================
function initCopyToClipboard() {
  if ($('.info-box').length) {
    $('.info-box p').each(function() {
      const text = $(this).text();
      if (text.includes('(555)') || text.includes('@') || text.includes('Street')) {
        const copyBtn = $('<button class="copy-btn" title="Copy to clipboard">📋</button>');
        $(this).css('position', 'relative').append(copyBtn);
        
        copyBtn.on('click', function(e) {
          e.stopPropagation();
          const textToCopy = $(this).parent().text().replace('📋', '').trim();
          const tempInput = $('<textarea>').val(textToCopy).appendTo('body').select();
          document.execCommand('copy');
          tempInput.remove();
          
          const btn = $(this);
          btn.text('✓').addClass('copied');
          showNotification('Copied to clipboard!', 'success');
          setTimeout(() => btn.text('📋').removeClass('copied'), 2000);
        });
      }
    });
  }
}

// ========================================
// PART 3 - TASK 9: Lazy Loading
// ========================================
function initLazyLoading() {
  $('.gallery-item img, .banner-image, .card img').each(function() {
    const img = $(this);
    const src = img.attr('src');
    img.attr('data-src', src);
    img.attr('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999"%3ELoading...%3C/text%3E%3C/svg%3E');
    img.addClass('lazy-load');
  });
  
  function loadVisibleImages() {
    $('.lazy-load').each(function() {
      const img = $(this);
      if ($(window).scrollTop() + $(window).height() > img.offset().top - 200) {
        const src = img.attr('data-src');
        if (src) {
          img.attr('src', src).removeClass('lazy-load').addClass('loaded');
        }
      }
    });
  }
  
  $(window).on('scroll', loadVisibleImages);
  loadVisibleImages();
}
