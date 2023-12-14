export default function createMarkup(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
                <a href="${largeImageURL}"><img width=300 max-height=220 src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
                <div class="info">
                <p class="info-item">
                <b>Likes <br><span> ${likes}</span></b>
                </p>
                <p class="info-item">
                <b>Views <br> <span>${views}</span></b>
                </p>
                <p class="info-item">
                <b>Comments <br> <span>${comments}</span></b>
                </p>
                <p class="info-item">
                <b>Downloads <br> <span>${downloads}</span></b>
                </p>
                </div>
                </div>`
    }).join('')

}

