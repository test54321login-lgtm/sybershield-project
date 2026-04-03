// Feed module for CyberShield project

function escapeHtml(s) {
  if (!s) return '';
  var result = '';
  for (var i = 0; i < s.length; i++) {
    var c = s[i];
    if (c === '&') result += '&amp;';
    else if (c === '<') result += '&lt;';
    else if (c === '>') result += '&gt;';
    else if (c === '"') result += '&quot;';
    else if (c === "'") result += '&#39;';
    else result += c;
  }
  return result;
}

async function loadFeed(category) {
    try {
        var url = '/api/feed';
        if (category && category !== 'All') {
            url += '?category=' + encodeURIComponent(category);
        }
        
        var response = await fetch(url);
        var data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load feed');
        }
        
        renderFeed(data.tips);
        updateActiveFilter(category);
        
    } catch (error) {
        console.error('Error loading feed:', error);
        showError('Failed to load news and tips: ' + error.message);
        
        var feedContent = document.getElementById('feedContent');
        if (feedContent) {
            feedContent.innerHTML = '<div class="error">Error loading feed: ' + escapeHtml(error.message) + '</div>';
        }
    }
}

function renderFeed(tips) {
    var feedContent = document.getElementById('feedContent');
    
    if (!tips || tips.length === 0) {
        feedContent.innerHTML = '<div class="empty-state">No tips or news available yet.</div>';
        return;
    }
    
    var feedHtml = '';
    for (var i = 0; i < tips.length; i++) {
        var tip = tips[i];
        var date = new Date(tip.createdAt).toLocaleDateString();
        var title = escapeHtml(tip.title);
        var content = escapeHtml(tip.content);
        var category = escapeHtml(tip.category);
        
        feedHtml += '<div class="feed-item">' +
            '<span class="category-tag category-' + category.toLowerCase() + '">' + category + '</span>' +
            '<h3>' + title + '</h3>' +
            '<p>' + content + '</p>' +
            '<small>Published on ' + date + '</small>' +
            '</div>';
    }
    
    feedContent.innerHTML = feedHtml;
}

function updateActiveFilter(category) {
    var filterButtons = document.querySelectorAll('.filter-btn');
    for (var i = 0; i < filterButtons.length; i++) {
        filterButtons[i].classList.remove('active');
    }
    
    var activeButton = document.querySelector('.filter-btn[data-category="' + category + '"]');
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

async function loadDailyTip() {
    try {
        var response = await fetch('/api/feed');
        var data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load daily tip');
        }
        
        if (data.tips && data.tips.length > 0) {
            var randomIndex = Math.floor(Math.random() * data.tips.length);
            var randomTip = data.tips[randomIndex];
            
            var dailyTipElement = document.getElementById('daily-tip');
            if (dailyTipElement) {
                var title = escapeHtml(randomTip.title);
                var content = escapeHtml(randomTip.content);
                var category = escapeHtml(randomTip.category);
                var date = new Date(randomTip.createdAt).toLocaleDateString();
                dailyTipElement.innerHTML = '<h3>' + title + '</h3><p>' + content + '</p><small>Category: ' + category + ' | Date: ' + date + '</small>';
            }
        } else {
            var dailyTipElement = document.getElementById('daily-tip');
            if (dailyTipElement) {
                dailyTipElement.textContent = 'Come back tomorrow for a new tip!';
            }
        }
        
    } catch (error) {
        console.error('Error loading daily tip:', error);
        var dailyTipElement = document.getElementById('daily-tip');
        if (dailyTipElement) {
            dailyTipElement.textContent = 'Unable to load today\'s tip. Please try again later.';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var filterButtons = document.querySelectorAll('.filter-btn');
    for (var i = 0; i < filterButtons.length; i++) {
        filterButtons[i].addEventListener('click', function() {
            var category = this.getAttribute('data-category');
            loadFeed(category);
        });
    }
    
    if (document.getElementById('feedContent')) {
        loadFeed();
    }
    
    if (document.getElementById('daily-tip')) {
        loadDailyTip();
    }
});