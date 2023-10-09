function renderGallery(hits) {
    const markup = hits
      .map(item => {
        return `
              <a href="${item.largeImageURL}" class="lightbox">
                  <div class="photo-card">
                      <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
                      <div class="info">
                          <p class="info-item">
                              <b>Likes</b>
                              ${item.likes}
                          </p>
                          <p class="info-item">
                              <b>Views</b>
                              ${item.views}
                          </p>
                          <p class="info-item">
                              <b>Comments</b>
                              ${item.comments}
                          </p>
                          <p class="info-item">
                              <b>Downloads</b>
                              ${item.downloads}
                          </p>
                      </div>
                  </div>
              </a>
              `;
      })
      .join('');
  
      elements.galleryEl.insertAdjacentHTML('beforeend', markup);
  
    if (options.params.page * options.params.per_page >= totalHits) {
      if (!reachedEnd) {
        Notify.info("We're sorry, but you've reached the end of search results.");
        reachedEnd = true;
      }
    }
    lightbox.refresh();
  }