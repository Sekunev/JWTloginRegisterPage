"use strict";
/* -------------------------------------------------------
    EXPRESS
------------------------------------------------------- */
// app.use(findSearchSortPage):

//! (Searching): İstek URL'sindeki search parametrelerini alır. Bu parametreler, arama anahtarlarına karşılık gelen değerleri içerir. Alınan değerlerin her biri için, bir dizi key: value çifti oluşturur ve bu değerlere göre MongoDB sorgusu oluşturur. Bu sayede, belirli kriterlere uyan kayıtları bulmak için arama yapılabilir.

//! (Sorting): İstek URL'sindeki sort parametresini alır. Bu parametreler, sıralama anahtarlarına karşılık gelen değerleri içerir. Alınan değerlere göre sıralama yaparak, sonuçları istenen sıralamaya göre düzenler.

//! (Pagination): İstek URL'sindeki page ve limit parametrelerini alır. limit, bir sayfada kaç kayıt gösterileceğini belirlerken, page ise hangi sayfanın gösterileceğini belirtir. Alınan değerlere göre belirli bir sayfaya gitmek için gerekli olan skip ve limit değerlerini hesaplar.

//! Model üzerinde arama, sıralama ve sayfalama işlemlerini gerçekleştirir: getModelList ve getModelListDetails fonksiyonlarını res nesnesine ekler. Bu fonksiyonlar, belirtilen model üzerinde arama, sıralama ve sayfalama işlemlerini gerçekleştirir ve sonuçları döndürür.

module.exports = (req, res, next) => {
  // Searching & Sorting & Pagination:

  // SEARCHING: URL?search[key1]=value1&search[key2]=value2
  const search = req.query?.search || {};
  for (let key in search) search[key] = { $regex: search[key], $options: "i" };

  // Cancelled -> SORTING: URL?sort[key1]=1&sort[key2]=-1 (1:ASC, -1:DESC)
  // mongoose=^8.0 -> SORTING: URL?sort[key1]=asc&sort[key2]=desc (asc: A->Z - desc: Z->A)
  const sort = req.query?.sort || {};

  // PAGINATION: URL?page=1&limit=10
  // LIMIT:
  let limit = Number(req.query?.limit);
  limit = limit > 0 ? limit : Number(process.env?.PAGE_SIZE || 20);
  // PAGE:
  let page = Number(req.query?.page);
  page = (page > 0 ? page : 1) - 1;
  // SKIP:
  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : page * limit;

  // Run SearchingSortingPagination engine for Model:
  res.getModelList = async function (Model, filters = {}, populate = null) {
    const filtersAndSearch = { ...filters, ...search };

    return await Model.find(filtersAndSearch)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate);
  };

  // Details:
  res.getModelListDetails = async function (Model, filters = {}) {
    const filtersAndSearch = { ...filters, ...search };

    const data = await Model.find(filtersAndSearch);

    let details = {
      search,
      sort,
      skip,
      limit,
      page,
      pages: {
        previous: page > 0 ? page : false,
        current: page + 1,
        next: page + 2,
        total: Math.ceil(data.length / limit),
      },
      totalRecords: data.length,
    };
    details.pages.next =
      details.pages.next > details.pages.total ? false : details.pages.next;
    if (details.totalRecords <= limit) details.pages = false;
    return details;
  };

  next();
};
