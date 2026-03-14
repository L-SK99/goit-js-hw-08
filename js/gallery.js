const images = [
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820__480.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820_1280.jpg',
    description: 'Hokkaido Flower',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg',
    description: 'Container Haulage Freight',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
    description: 'Aerial Beach View',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg',
    description: 'Flower Blooms',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg',
    description: 'Alpine Mountains',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg',
    description: 'Mountain Lake Sailing',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg',
    description: 'Alpine Spring Meadows',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg',
    description: 'Nature Landscape',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg',
    description: 'Lighthouse Coast Sea',
  },
];

// render gallery items from the images array
const galleryEl = document.querySelector('.gallery');

const galleryMarkup = images
  .map(
    ({ preview, original, description }) => `
    <li class="gallery-item">
      <a class="gallery-link" href="${original}">
        <img
          class="gallery-image"
          src="${preview}"
          data-source="${original}"
          alt="${description}"
        />
      </a>
    </li>`
  )
  .join('');

galleryEl.innerHTML = galleryMarkup;

let currentIndex = 0;
let modalInstance = null;

// build the modal markup: top bar with counter and close button,
// left/right arrows outside the image, caption bar at the bottom of the photo
function getModalTemplate(src, alt, index) {
  return `
    <div class="modal-layout">
      <div class="modal-top-bar">
        <span class="modal-counter">${index + 1}/${images.length}</span>
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">
        <button class="modal-arrow modal-arrow--prev" aria-label="Previous">&#8249;</button>
        <div class="modal-container">
          <img class="modal-img" src="${src}" alt="${alt}" width="1400" height="900" />
          <p class="modal-caption">${alt}</p>
        </div>
        <button class="modal-arrow modal-arrow--next" aria-label="Next">&#8250;</button>
      </div>
    </div>
  `;
}

function openModal(index) {
  currentIndex = index;
  const { original, description } = images[currentIndex];

  modalInstance = basicLightbox.create(
    getModalTemplate(original, description, currentIndex),
    {
      closable: false,
      onShow: () => {
        bindModalControls();
        document.addEventListener('keydown', onKeyDown);
      },
      onClose: () => {
        document.removeEventListener('keydown', onKeyDown);
      },
    }
  );

  modalInstance.show();
}

// switch to a different image with a slide animation
// the image slides out in the opposite direction to the arrow clicked
function navigateTo(newIndex, direction) {
  const el = modalInstance.element();
  const container = el.querySelector('.modal-container');
  const img = el.querySelector('.modal-img');
  const counter = el.querySelector('.modal-counter');
  const caption = el.querySelector('.modal-caption');

  const outClass = direction === 'next' ? 'slide-left' : 'slide-right';
  container.classList.add(outClass);

  setTimeout(() => {
    currentIndex = (newIndex + images.length) % images.length;
    const { original, description } = images[currentIndex];

    counter.textContent = `${currentIndex + 1}/${images.length}`;
    caption.textContent = description;

    // replace the src before the new image appears
    img.src = original;
    img.alt = description;

    container.classList.remove(outClass);
    // force reflow so the browser registers the class removal
    // before the new animation class is added
    void container.offsetWidth;
    const inClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';
    container.classList.add(inClass);

    container.addEventListener(
      'animationend',
      () => container.classList.remove(inClass),
      { once: true }
    );
  }, 300);
}

function bindModalControls() {
  const el = modalInstance.element();

  el.querySelector('.modal-close').addEventListener('click', () => {
    modalInstance.close();
  });

  el.querySelector('.modal-arrow--prev').addEventListener('click', () => {
    navigateTo(currentIndex - 1, 'prev');
  });

  el.querySelector('.modal-arrow--next').addEventListener('click', () => {
    navigateTo(currentIndex + 1, 'next');
  });
}

function onKeyDown(e) {
  if (e.key === 'Escape')     modalInstance.close();
  if (e.key === 'ArrowLeft')  navigateTo(currentIndex - 1, 'prev');
  if (e.key === 'ArrowRight') navigateTo(currentIndex + 1, 'next');
}

// use event delegation so we only need one listener for the whole gallery
galleryEl.addEventListener('click', e => {
  e.preventDefault();

  if (!e.target.classList.contains('gallery-image')) return;

  const clickedSrc = e.target.dataset.source;
  const index = images.findIndex(img => img.original === clickedSrc);

  if (index === -1) return;

  console.log('Large image URL:', clickedSrc);

  openModal(index);
});