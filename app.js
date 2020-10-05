const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');
function renderCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);
    cafeList.appendChild(li);

     //deleting data
     cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        console.log(id);
        db.collection('cafes').doc(id).delete()
    });
}


// getting data
// let docs = db.collection('cafes').where('city','==','Curitiba');
// let docs = db.collection('cafes').orderBy('city');
// let docs = db.collection('cafes').where('city','==','Curitiba').orderBy('name');
// let docs = db.collection('cafes');
// docs.get().then( (snapshot) => {
//     snapshot.forEach((doc) => {
//         renderCafe(doc);
//     });
// })



// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = "";
    form.city.value = "";
})



// real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderCafe(change.doc);
        }
        else if(change.type == 'removed'){
            let li = cafeList.querySelector('[data-id='+change.doc.id+']');
            cafeList.removeChild(li);
        }
        else if(change.type == 'modified'){
            let li = cafeList.querySelector('[data-id='+change.doc.id+']');
            cafeList.removeChild(li);
            renderCafe(change.doc);
        }
        else{
            console.log(change.type);
        }
        // console.log(change.doc.data())
    })
});


