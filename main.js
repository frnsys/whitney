const imgUrl = 'https://client.frnsys.com/aa/boards.jpg';
const imgDims = {
  width: 1800,
  height: 1056
};
const targetEls = 'img, .youtube-image, .video-embed__preview, iframe';

// Get position of element relative to body
function getPos(elem) {
  let box = elem.getBoundingClientRect();

  let body = document.body;
  let docEl = document.documentElement;

  let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  let clientTop = docEl.clientTop || body.clientTop || 0;
  let clientLeft = docEl.clientLeft || body.clientLeft || 0;

  let top  = box.top +  scrollTop - clientTop;
  let left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
}

function activate() {
  // Set background to black, text to grey
  document.documentElement.style.setProperty('--color-background', 'black');
  document.documentElement.style.setProperty('--color-text', '#666666');

  // Hide Whitney logo image
  let logo = document.getElementById('w__text');
  if (logo) logo.style.display = 'none';

  [...document.querySelectorAll(targetEls)].forEach((img) => {
    // Replace iframes with imgs
    if (img.tagName === 'iframe') {
      let el = img;
      let width = img.width;
      let height = img.height;
      img = document.createElement('img');
      img.width = width;
      img.height = height;
      img.parentNode.replaceChild(img, el);
    }

    // Maintain dimensions
    img.style.width = `${img.width}px`;
    img.style.height = `${img.height}px`;

    // Clear existing image
    img.src = '';
    img.srcset = '';

    // Setting as a background image gives a bit more control
    img.style.backgroundImage = `url(${imgUrl})`;
    img.style.backgroundRepeat = 'no-repeat';
    img.style.backgroundSize = 'auto';

    // Position so it looks like the wood is behind the page
    let pos = getPos(img);
    let top = pos.top % imgDims.height;
    let left = pos.left % imgDims.width;
    if (top + img.height > imgDims.height) {
      top -= (top + img.height) - imgDims.height;
    }
    if (left + img.width > imgDims.width) {
      left -= (left + img.width) - imgDims.width;
    }

    // Video embed previews have additional styling that
    // mess with the background position offset,
    // so skip the vertical position there
    if (img.classList.contains('video-embed__preview')) {
      img.style.backgroundPosition = `-${left}px 0%`;
    } else {
      img.style.backgroundPosition = `-${left}px -${top}px`;
    }

    // Do our best to honor alt text needs
    img.alt = '';
    img.role = 'img';
    img.setAttribute('aria-label', 'Wood paneling');
  });
}

activate();