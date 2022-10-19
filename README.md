# duvi-backend
---

## .env

- ROOT_URL
- SECRET_JWT_USER

## endpoints (/api/...)

### Auth
- POST
   - /register
   - /login
   - /login/identifyUser
---

### Category
- GET
   - / -> GET categories
   - /:id -> GET category by id

- POST 
   - /createCategory -> POST category

- PUT
   - /update/:id -> PUT category

- DELETE
   - /delete/:id -> DELETE category
---

### Duvi
- GET
   - / -> GET duvis
   - /:id -> GET duvi by id
  
- POST
   - / -> POST duvi

- PUT 
   - /update/:id -> PUT duvi
   - /profilePic/:id -> PUT duvi profile pic
   - /bannerPic/:id -> PUT duvi banner pic
---

### Product
- GET
   - / -> GET products
   - /category/:category -> GET products by category
   - /:id -> GET product by id

- POST
   - /create -> CREATE product
   - /:id/addImage -> ADD product image

- PUT
   - /:id/principalImage -> CHANGE principal image

- DELETE
   - /:id/:filename -> DELETE image
   - /:id -> DELETE product

---
### SUBCATEGORY
- GET
   - /get -> GET subcategories
   - /get/:id -> GET subcategory by id
   - /get/category/:category -> GET subcategories by category

- POST
   - /create -> CREATE subcategory

- PUT
   - /update/:id -> PUT subcategory

- DELETE
   - /:id -> DELETE subcategory
   
