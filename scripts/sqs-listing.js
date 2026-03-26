(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  function init() {
    
/* Nav: Podcast 링크 추가 */
(function() {
  function addPodcastLink() {
    var navWrappers = document.querySelectorAll('.header-nav-wrapper');
    navWrappers.forEach(function(nav) {
      if (nav.querySelector('[data-podcast-link]')) return;
      var items = nav.querySelectorAll('.header-nav-item--collection');
      var lastItem = items[items.length - 1];
      if (!lastItem) return;
      var li = lastItem.cloneNode(true);
      li.setAttribute('data-podcast-link', '1');
      var a = li.querySelector('a');
      if (a) {
        a.href = 'https://podcast.smath.world/';
        a.textContent = 'Podcast';
        a.removeAttribute('aria-current');
        a.classList.remove('header-nav-item--active');
      }
      lastItem.parentNode.insertBefore(li, lastItem);
    });
    /* 모바일 메뉴에도 추가 */
    var mobileNavs = document.querySelectorAll('.header-menu-nav-wrapper');
    mobileNavs.forEach(function(nav) {
      if (nav.querySelector('[data-podcast-link]')) return;
      var items = nav.querySelectorAll('.header-menu-nav-item');
      var lastItem = items[items.length - 1];
      if (!lastItem) return;
      var li = lastItem.cloneNode(true);
      li.setAttribute('data-podcast-link', '1');
      var a = li.querySelector('a');
      if (a) {
        a.href = 'https://podcast.smath.world/';
        a.textContent = 'Podcast';
        a.removeAttribute('aria-current');
      }
      lastItem.parentNode.insertBefore(li, lastItem);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addPodcastLink);
  } else {
    addPodcastLink();
  }
})();



/* v20260312-grid4v2 */
(function() {
  if (document.body.classList.contains('view-item')) return;

  var wrapper = document.querySelector('.blog-single-column--wrapper');
  if (!wrapper) return;

  var tagMap = {};
  var pathname = window.location.pathname.replace(/\/$/, '') || '/trendnews';

  fetch(pathname + '?format=json&nocache=' + Date.now())
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var items = (data.items || data.result || []);
      items.forEach(function(item) {
        if (item.title && item.tags) tagMap[item.title.trim()] = item.tags;
        if (item.urlId && item.tags) tagMap[item.urlId] = item.tags;
      });
      transformCards();
    })
    .catch(function() { transformCards(); });

  function transformCards() {
    var articles = wrapper.querySelectorAll('article.blog-single-column--container');

    // 소개 배너
    if (articles.length > 0 && !wrapper.querySelector('.feed-intro-banner')) {
      var banner = document.createElement('div');
      banner.className = 'feed-intro-banner';
      banner.innerHTML = '<h2>랩온담 AI 트렌드 브리핑</h2>' +
        '<p>랩온담이 매일 정리하는 AI·테크 이슈 브리핑.<br>' +
        '중요한 변화와 시장 신호를 빠르게 읽을 수 있도록 정리합니다.</p>' +
        '<p style="margin-top:10px"><a href="/trendnews/how-we-publish">How We Publish →</a></p>';
      wrapper.insertBefore(banner, articles[0]);
    }

    articles.forEach(function(art) {
      var titleEl = art.querySelector('h1.blog-title a');
      var titleText = titleEl ? titleEl.textContent.trim() : '';
      var titleHref = titleEl ? titleEl.getAttribute('href') : '';
      var metaEl = art.querySelector('.blog-meta-section');
      var dateEl = metaEl ? metaEl.querySelector('time.blog-date') : null;
      var dateText = dateEl ? dateEl.textContent.trim() : '';

      // 이미지 추출
      var bodyWrapper = art.querySelector('.blog-body-wrapper');
      var imgs = bodyWrapper ? bodyWrapper.querySelectorAll('img') : [];
      var imgSrcs = [];
      imgs.forEach(function(img) {
        var src = img.getAttribute('data-src') || img.src;
        if (src && src.indexOf('http') === 0) imgSrcs.push(src);
      });

      // 캡션 텍스트 추출
      var paras = bodyWrapper ? bodyWrapper.querySelectorAll('p') : [];
      var captionLines = [];
      paras.forEach(function(p) {
        var t = p.textContent.trim();
        if (t && t.length > 10 && !t.startsWith('🎧') && !t.startsWith('이 글의 오디오')) {
          captionLines.push(t);
        }
      });
      var captionText = captionLines.slice(0, 2).join(' ');
      if (captionText.length > 120) captionText = captionText.substring(0, 120) + '…';

      // 첫 문장 굵게
      var firstDot = captionText.indexOf('.');
      var captionHTML = '';
      if (firstDot > 0 && firstDot < 60) {
        captionHTML = '<span class="feed-caption-bold">' + captionText.substring(0, firstDot + 1) + '</span>' + captionText.substring(firstDot + 1);
      } else {
        captionHTML = captionText;
      }

      // 오디오 체크
      var hasAudio = bodyWrapper ? bodyWrapper.querySelector('audio') !== null : false;

      // 태그
      var tags = tagMap[titleText] || [];
      if (!tags.length) {
        var slug = titleHref ? titleHref.split('/').pop() : '';
        tags = tagMap[slug] || [];
      }

      // ── DOM 재구성 ──
      art.innerHTML = '';

      // 1. 썸네일
      var thumb = document.createElement('div');
      thumb.className = 'feed-thumb';

      if (imgSrcs.length > 0) {
        var img = document.createElement('img');
        img.src = imgSrcs[0];
        img.alt = titleText;
        img.loading = 'lazy';
        thumb.appendChild(img);
      } else {
        var empty = document.createElement('div');
        empty.className = 'feed-thumb-empty';
        empty.textContent = '📝';
        thumb.appendChild(empty);
      }

      // 카테고리 뱃지
      // (카테고리 뱃지 제거됨)

      // (팟캐스트 아이콘, 이미지 개수 표시 제거됨)

      art.appendChild(thumb);

      // 2. 카드 본문
      var body = document.createElement('div');
      body.className = 'feed-card-body';

      // 제목
      var title = document.createElement('h2');
      title.className = 'feed-title';
      if (titleHref) {
        title.innerHTML = '<a href="' + titleHref + '">' + escapeHTML(titleText) + '</a>';
      } else {
        title.textContent = titleText;
      }
      body.appendChild(title);

      // 태그
      if (tags.length > 0) {
        var tagDiv = document.createElement('div');
        tagDiv.className = 'feed-tags';
        tagDiv.textContent = tags.slice(0, 4).map(function(t) { return '#' + t.replace(/\s+/g, ''); }).join(' ');
        body.appendChild(tagDiv);
      }

      // 캡션
      if (captionHTML) {
        var caption = document.createElement('div');
        caption.className = 'feed-caption';
        caption.innerHTML = captionHTML;
        body.appendChild(caption);
      }

      art.appendChild(body);

      // 3. 하단
      var footer = document.createElement('div');
      footer.className = 'feed-card-footer';

      var dateDiv = document.createElement('span');
      dateDiv.className = 'feed-date';
      dateDiv.textContent = dateText;
      footer.appendChild(dateDiv);

      if (titleHref) {
        var readMore = document.createElement('a');
        readMore.className = 'feed-read-more';
        readMore.href = titleHref;
        readMore.textContent = '본문 보기 →';
        footer.appendChild(readMore);
      }

      art.appendChild(footer);

      art.classList.add('feed-ready');
      art.style.cssText += 'height:auto!important;min-height:0!important;max-height:none!important;';
    });

    // grid-template-rows 강제 해제 (Squarespace가 고정 행 높이 설정)
    wrapper.style.setProperty('grid-template-rows', 'none', 'important');

    // 하단 푸터
    if (!wrapper.querySelector('.ondamlab-footer')) {
      var footerEl = document.createElement('div');
      footerEl.className = 'ondamlab-footer';
      footerEl.innerHTML = '<p>랩온담은 스마스월드의 AI 콘텐츠 실험 공간입니다.</p>' +
        '<p><a href="/trendnews/how-we-publish">How We Publish</a> · <a href="mailto:contact@smath.world">contact@smath.world</a></p>';
      wrapper.appendChild(footerEl);
    }
  }

  function guessCategoryFromTags(tags) {
    if (!tags || !tags.length) return null;
    var joined = tags.join(' ').toLowerCase();
    if (joined.match(/ai|인공지능|llm|gpt|딥러닝|머신러닝/)) return 'AI';
    if (joined.match(/투자|etf|주식|배당|금융|펀드|증시/)) return '금융';
    if (joined.match(/반도체|칩|gpu|nvidia|엔비디아|tsmc/)) return '반도체';
    if (joined.match(/보안|해킹|사이버|옵저버빌리티/)) return '보안';
    if (joined.match(/로봇|자율주행|모빌리티/)) return '로봇';
    if (joined.match(/클라우드|서버|인프라|데이터센터/)) return '클라우드';
    if (joined.match(/스타트업|창업|벤처/)) return '스타트업';
    return '테크';
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();

// ── Listing page SEO meta ──
(function() {
  if (document.body.classList.contains('view-item')) return;
  var path = window.location.pathname.replace(/\/$/, '');
  if (path === '/trendnews' || path === '') {
    document.title = '랩온담 AI 트렌드 브리핑 | SMATh World';
    var setMeta = function(attr, name, content) {
      var el = document.querySelector('meta[' + attr + '="' + name + '"]');
      if (el) { el.setAttribute('content', content); }
      else { var m = document.createElement('meta'); m.setAttribute(attr, name); m.setAttribute('content', content); document.head.appendChild(m); }
    };
    var desc = '랩온담이 매일 정리하는 AI·테크 이슈 브리핑. 중요한 변화와 시장 신호를 빠르게 읽을 수 있도록 정리합니다.';
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', '랩온담 AI 트렌드 브리핑 | SMATh World');
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', 'https://www.smath.world/trendnews');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', '랩온담 AI 트렌드 브리핑 | SMATh World');
    setMeta('name', 'twitter:description', desc);
  }
})();

// ── Article JSON-LD + OG image for detail pages ──
(function() {
  if (!document.body.classList.contains('view-item')) return;
  var titleEl = document.querySelector('h1.entry-title, h1.blog-title, .blog-item-title h1');
  if (!titleEl) return;
  var title = titleEl.textContent.trim();
  var dateEl = document.querySelector('time.blog-date, time.dt-published, .entry-dateline time');
  var dateStr = dateEl ? dateEl.getAttribute('datetime') || dateEl.textContent.trim() : '';
  var desc = '';
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) desc = metaDesc.getAttribute('content') || '';
  if (!desc) {
    var firstP = document.querySelector('.blog-item-content p, .entry-content p');
    if (firstP) desc = firstP.textContent.trim().substring(0, 160);
  }
  var img = '';
  var firstImg = document.querySelector('.blog-item-content img, .entry-content img');
  if (firstImg) img = firstImg.src || '';
  if (!img) {
    var ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) img = ogImg.getAttribute('content') || '';
  }
  var ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': title,
    'description': desc,
    'url': window.location.href,
    'inLanguage': 'ko',
    'author': {'@type': 'Organization', 'name': 'Lab Ondam', 'alternateName': '랩온담'},
    'publisher': {'@type': 'Organization', 'name': 'SMATh World', 'alternateName': '스마스월드', 'url': 'https://www.smath.world'}
  };
  if (dateStr) ld['datePublished'] = dateStr;
  if (img) ld['image'] = img;
  var s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(ld);
  document.head.appendChild(s);

  // og:image / twitter:image → 본문 첫 이미지 (히어로)
  if (img && img.indexOf('favicon') === -1) {
    var setMeta = function(attr, name, content) {
      var el = document.querySelector('meta[' + attr + '="' + name + '"]');
      if (el) { el.setAttribute('content', content); }
      else { var m = document.createElement('meta'); m.setAttribute(attr, name); m.setAttribute('content', content); document.head.appendChild(m); }
    };
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('name', 'twitter:image', img);
    setMeta('name', 'twitter:card', 'summary_large_image');
  }
})();

// ── Canonical URL 설정 (모든 페이지) ──
(function() {
  if (document.querySelector('link[rel="canonical"]')) return;
  var link = document.createElement('link');
  link.rel = 'canonical';
  link.href = window.location.origin + window.location.pathname;
  document.head.appendChild(link);
})();

// ── 상세 페이지: meta description 보강 ──
(function() {
  if (!document.body.classList.contains('view-item')) return;
  var metaDesc = document.querySelector('meta[name="description"]');
  var content = metaDesc ? (metaDesc.getAttribute('content') || '') : '';
  if (!content || content.length < 30) {
    var firstP = document.querySelector('.blog-item-content p, .entry-content p');
    if (firstP) {
      var text = firstP.textContent.trim().replace(/^🎧.*$/, '').replace(/이 글의 오디오.*/, '').trim();
      if (text.length > 20) {
        var desc = text.length > 155 ? text.substring(0, 155) + '...' : text;
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', desc);
      }
    }
  }
})();

// ── 상세 페이지: 소셜 공유 바 ──
(function() {
  if (!document.body.classList.contains('view-item')) return;
  var contentEl = document.querySelector('.blog-item-content-wrapper');
  if (!contentEl) return;

  var titleEl = document.querySelector('h1.entry-title, h1.blog-title, .blog-item-title h1');
  var title = titleEl ? titleEl.textContent.trim() : document.title;
  var url = window.location.href;
  var eu = encodeURIComponent(url);
  var et = encodeURIComponent(title);

  var copyIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
  var checkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';

  var shares = [
    { cls: 'share-btn-naver', href: 'https://share.naver.com/web/shareView?url=' + eu + '&title=' + et, label: '네이버',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.27 10.7L7.4 3H4v18h3.73V13.3L16.6 21H20V3h-3.73z"/></svg>' },
    { cls: 'share-btn-x', href: 'https://twitter.com/intent/tweet?url=' + eu + '&text=' + et, label: 'X',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
    { cls: 'share-btn-facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=' + eu, label: '페이스북',
      icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' }
  ];

  var bar = document.createElement('div');
  bar.className = 'share-bar';

  var label = document.createElement('span');
  label.className = 'share-bar-label';
  label.textContent = '공유하기';
  bar.appendChild(label);

  shares.forEach(function(s) {
    var a = document.createElement('a');
    a.className = 'share-btn ' + s.cls;
    a.href = s.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.title = s.label + ' 공유';
    a.innerHTML = s.icon + s.label;
    bar.appendChild(a);
  });

  // 링크 복사 버튼
  var copyBtn = document.createElement('button');
  copyBtn.className = 'share-btn share-btn-copy';
  copyBtn.title = '링크 복사';
  copyBtn.innerHTML = copyIcon + '링크 복사';
  copyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(url).then(function() {
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = checkIcon + '복사됨';
      setTimeout(function() {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = copyIcon + '링크 복사';
      }, 2000);
    });
  });
  bar.appendChild(copyBtn);

  // 본문 끝, 관련 포스트 전에 삽입
  var blogContent = contentEl.querySelector('.blog-item-content, .e-content, .sqs-layout');
  if (blogContent) {
    blogContent.parentNode.insertBefore(bar, blogContent.nextSibling);
  } else {
    contentEl.appendChild(bar);
  }
})();

// ── 상세 페이지: 관련 포스트 표시 ──
(function() {
  if (!document.body.classList.contains('view-item')) return;
  var contentEl = document.querySelector('.blog-item-content-wrapper');
  if (!contentEl) return;

  fetch('/trend?format=json&limit=50&nocache=' + Date.now())
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var items = data.items || [];
      var currentPath = window.location.pathname;
      // 현재 글 제외, 최근 4개 선택
      var related = items.filter(function(item) {
        return item.fullUrl !== currentPath && item.urlId;
      }).slice(0, 4);
      if (related.length === 0) return;

      var html = '<div style="border-top:2px solid #e5e7eb;margin-top:3em;padding-top:2em">';
      html += '<h3 style="font-size:20px;font-weight:800;font-family:\'Noto Sans KR\',sans-serif;margin-bottom:16px;color:#1a1a1a">다른 브리핑도 읽어보기</h3>';
      html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">';
      related.forEach(function(item) {
        var thumbUrl = '';
        if (item.assetUrl) thumbUrl = item.assetUrl + '?format=300w';
        var title = item.title || '';
        if (title.length > 35) title = title.substring(0, 35) + '…';
        html += '<a href="' + (item.fullUrl || '/trendnews/' + item.urlId) + '" style="text-decoration:none;display:flex;gap:10px;padding:10px;border:1px solid #e5e7eb;border-radius:8px;transition:background 0.2s" onmouseover="this.style.background=\'#f9fafb\'" onmouseout="this.style.background=\'transparent\'">';
        if (thumbUrl) {
          html += '<img src="' + thumbUrl + '" alt="' + title.replace(/"/g, '') + '" style="width:80px;height:56px;object-fit:cover;border-radius:6px;flex-shrink:0" loading="lazy"/>';
        }
        html += '<span style="font-size:14px;font-weight:600;font-family:\'Noto Sans KR\',sans-serif;color:#1a1a1a;line-height:1.4;align-self:center">' + title + '</span>';
        html += '</a>';
      });
      html += '</div></div>';
      contentEl.insertAdjacentHTML('beforeend', html);
    })
    .catch(function() {});
})();

  }
})();
