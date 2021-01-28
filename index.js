const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const postData = fs.readFileSync("data.json");
const categoryData = fs.readFileSync("categoryData.json");
let posts = JSON.parse(postData);
let category = JSON.parse(categoryData);
const app = express();


/* ==============================
        *** Middleware ***
================================= */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*====================================================================
                *** All API ***
======================================================================*/

// Root API
app.get("/", (req, res) => {
    res.send(posts);
  });

// add new post
app.post("/add-product", (req, res) => {
    const info = req.body;
    info.id = posts.length;
    posts = [...posts, info];
    fs.writeFile("data.json", JSON.stringify(posts), function () {});
    res.send(posts);
})

// get product details by id
app.get("/product-details/:id", (req, res) => {
    const productDetails = posts.find(p => p.id == req.params.id);
    productDetails.relatedProducts = relatedProductsShort(productDetails.id, productDetails.date);
    res.send(productDetails);
})

// get category
app.get("/category", (req, res) => {
    res.send(category);
})

// add category
app.post("/add-category", (req, res) => {
    category = [...category, req.body.category];
    fs.writeFile("categoryData.json", JSON.stringify(category), function () {});
    res.send(category);
})
/*-------------------------------------------------------------------
                *** API End ***
---------------------------------------------------------------------*/


/*====================================================================
            *** Listening Request ***
======================================================================*/
const port = 4000;
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


function relatedProductsShort(productID, date){
    const relatedProducts = [];
    const rel = posts.filter(pd => pd.date == date && pd.id != productID);
    rel.forEach(re => {
        relatedProducts.push({id: re.id, title: re.title, imgUrls: [re.imgUrls[0]]})
    })
    return relatedProducts;
}