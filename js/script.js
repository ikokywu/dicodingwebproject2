const showInputBookBtn = document.querySelector(".add-task button"),
  inputBook = document.querySelector(".add-book"),
  readMenu = document.querySelectorAll(".list .title button"),
  addBookBtn = document.querySelector(".add-button button");
(bookListContainer = document.querySelector(".list-book")),
  (bookList = document.querySelectorAll(".book")),
  (notification = document.querySelector(".notification")),
  ((searchInput = document.querySelector(".search-book")),
  (books = document.querySelector(".about-book p"))),
  (dateText = document.querySelector(".date p"));

let bookNameInput = document.querySelector(".book-name"),
  bookAuthorInput = document.querySelector(".author"),
  bookYearInput = document.querySelector(".year"),
  checkbox = document.querySelector(".checkbox input");

let isComplete = false;

document.addEventListener("click", (e) => {
  const bookElement = e.target.closest(".book");
  const uniqueId = bookElement
    ? bookElement.querySelector(".unique-id")
    : false;

  // tampilkan tombol hapus dan selesai
  if (!bookElement) {
    hideAllButtons();
  } else {
    const element = bookElement.querySelector(".hidden-button");
    hideAllButtons();
    element.classList.remove("hidden");
  }

  // menghapus buku
  if (e.target.classList.contains("delete")) {
    deleteBook(uniqueId.value);
  }

  // mengedit buku
  if (e.target.classList.contains("edit")) {
    editBook(uniqueId.value);
  }

  // pindahkan buku ke rak "Sudah dibaca"
  if (e.target.classList.contains("completed")) {
    changeBookStatus(uniqueId.value, true);
  }

  // pindahkan buku ke rak "Belum dibaca"
  if (e.target.classList.contains("undo")) {
    changeBookStatus(uniqueId.value, false);
  }
});

// sembunyikan semua tombol hapus dan selesai
const hideAllButtons = () => {
  optionsBtn = document.querySelectorAll(".hidden-button");
  optionsBtn.forEach((btn) => {
    if (!btn.classList.contains("hidden")) {
      btn.classList.add("hidden");
    }
  });
};

// fungsi hapus buku
const deleteBook = (id) => {
  let localData = getLocalData();

  localData = localData.filter((e) => {
    return e.id !== id;
  });

  localStorage.setItem("booksList", JSON.stringify(localData));
  getLocalStorageData(isComplete);

  showNofitication(false);
};

// fungsi edit buku
const editBook = (id) => {
  let uniqueId = document.querySelector(".unique-id-cloning");
  let localData = getLocalData();

  disableBtn(true);
  localData = localData.filter((data) => {
    if (data.id === id) {
      data.id = id;
      return data;
    }
  });

  uniqueId.value = id;
  bookNameInput.value = localData[0].title;
  bookAuthorInput.value = localData[0].author;
  bookYearInput.value = localData[0].year;
  checkbox.checked = localData[0].isComplete;

  addBookBtn.innerText = "Simpan";
  inputBook.classList.remove("hidden");

  hideAllButtons();
};

// fungsi menyimpan data yang diedit
const saveBookData = (id) => {
  let localData = getLocalData();

  localData = localData.filter((data) => {
    if (data.id === id) {
      data.id = id;
      data.title = bookNameInput.value;
      data.author = bookAuthorInput.value;
      data.year = bookYearInput.value;
      data.isComplete = checkbox.checked;
    }
    return data;
  });

  bookListContainer.innerHTML = "";
  localStorage.setItem("booksList", JSON.stringify(localData));
  localData.forEach((data) => {
    saveToHtml(data, isComplete);
  });
  getLocalStorageData(isComplete);
};

// fungsi mengubah status buku
const changeBookStatus = (id, status) => {
  let localData = getLocalData();

  localData = localData.filter((data) => {
    if (data.id === id) {
      data.isComplete = status;
    }
    return data;
  });

  localStorage.setItem("booksList", JSON.stringify(localData));
  getLocalStorageData(isComplete);
};

// ketika tombol tambah diklik
addBookBtn.addEventListener("click", (e) => {
  if (
    bookNameInput.value === "" ||
    bookYearInput.value === "" ||
    bookAuthorInput.value === ""
  ) {
    return;
  }

  if (addBookBtn.innerText === "Simpan") {
    saveButton(e);
    disableBtn(false);
    return;
  }

  e.preventDefault();
  const currentDate = new Date();
  const id = `${currentDate.getMilliseconds()}${currentDate.getSeconds()}${currentDate.getMinutes()}${currentDate.getHours()}`;

  let books = {
    id,
    title: bookNameInput.value,
    author: bookAuthorInput.value,
    year: bookYearInput.value,
    isComplete: checkbox.checked,
  };

  saveToHtml(books);
  saveToLocalStorage(books);
  showNofitication(true);

  restartInput();
  checkbox.checked = false;
});

// fungsi tombol simpan
const saveButton = (e) => {
  e.preventDefault();
  let uniqueId = document.querySelector(".unique-id-cloning");
  saveBookData(uniqueId.value);

  restartInput();
  checkbox.checked = false;

  addBookBtn.innerText = "Tambah";
  inputBook.classList.add("hidden");
  searchInput.value = "";
  showNofitication(true);
};

// fungsi tampilkan notifikasi
const showNofitication = (status) => {
  notification.querySelector("p").innerText = status
    ? "Data berhasil disimpan!"
    : "Data berhasil dihapus!";
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 1200);
};

// menyimpan data ke html
const saveToHtml = (data, status) => {
  const buttonLabel = status ? "Undo" : "Selesai",
    buttonClass = status ? "undo" : "completed";

  const bookHtml = `
  <div class="book">
    <input type="hidden" class="unique-id" value="${data.id}">
    <div class="information">
      <div class="book-info">
        <i class="fa-solid fa-book"></i>
        <div class="about-info">
          <h3>${data.title}</h3>
          <p>${data.author}, ${data.year}</p>
        </div>
      </div>
      <i class="fa-solid fa-caret-down"></i>
    </div>
    <div class="hidden-button hidden">
      <button class="delete">Hapus</button>
      <button class="edit">Edit</button>
      <button class="change ${buttonClass}">${buttonLabel}</button>
    </div>
  </div>`;

  bookListContainer.innerHTML += bookHtml;
};

// ketika menu "Belum dibaca" dan "Sudah dibaca" diklik
readMenu.forEach((btn) => {
  btn.addEventListener("click", () => {
    bookListContainer.innerHTML = "";
    for (const menu of readMenu) {
      if (menu.classList.contains("active")) {
        menu.classList.remove("active");
      }
    }

    btn.classList.add("active");

    if (btn.classList.contains("read")) {
      isComplete = true;
    } else {
      isComplete = false;
    }

    if (searchInput.value) {
      searchDataInput(searchInput.value);
      return;
    }

    getLocalStorageData(isComplete);
  });
});

// menu untuk menampilkan form tambah buku
showInputBookBtn.addEventListener("click", () => {
  if (inputBook.classList.contains("hidden")) {
    showInputBookBtn.innerText = "Hilangkan";
  } else {
    showInputBookBtn.innerText = "Tambah buku";
  }
  inputBook.classList.toggle("hidden");
});

// input mencari data buku
searchInput.addEventListener("input", (e) => {
  searchDataInput(searchInput.value);
});

// fungsi menyeleksi data dari isi input
const searchDataInput = (input) => {
  let localData = getLocalData();

  const searchResults = localData.filter((item) => {
    const regex = new RegExp(input.toLowerCase(), "g");
    return item.title.toLowerCase().match(regex);
  });

  const result = searchResults.filter((data) => {
    if (data.isComplete === isComplete) {
      return data;
    }
  });
  bookListContainer.innerHTML = "";

  result.forEach((data) => {
    saveToHtml(data, isComplete);
  });
};

// mendapatkan data dari local storage
const getLocalStorageData = (isComplete) => {
  let localData = localStorage.getItem("booksList");

  if (!localData) {
    books.innerText = "0 Buku";
    return;
  }
  localData = JSON.parse(localData);
  books.innerText = `${localData.length} Buku`;
  bookListContainer.innerHTML = "";

  localData.forEach((data) => {
    if (isComplete === false) {
      if (data.isComplete === false) {
        saveToHtml(data);
      }
    } else {
      if (data.isComplete === true) {
        saveToHtml(data, true);
      }
    }
  });
};
getLocalStorageData(false);

// menyimpan data ke local storage
const saveToLocalStorage = (books) => {
  const localData = localStorage.getItem("booksList");

  if (localData) {
    const data = JSON.parse(localData);
    data.push(books);

    localStorage.setItem("booksList", JSON.stringify(data));
  } else {
    localStorage.setItem("booksList", JSON.stringify([books]));
  }

  getLocalStorageData(isComplete);
};

// funsgi mendapatkan data local
const getLocalData = () => {
  let localData = localStorage.getItem("booksList");
  return JSON.parse(localData);
};

// fungsi mengkosongkan input
const restartInput = () => {
  bookNameInput.value = "";
  bookYearInput.value = "";
  bookAuthorInput.value = "";
};

// menonaktifkan tombol
const disableBtn = (status) => {
  let deleteBtn = document.querySelectorAll(".hidden-button .delete");
  let changeBtn = document.querySelectorAll(".hidden-button .change");
  if (status) {
    showInputBookBtn.classList.add("disable");
    deleteBtn.forEach((e) => {
      e.classList.add("disable");
    });

    changeBtn.forEach((e) => {
      e.classList.add("disable");
    });
  } else {
    showInputBookBtn.classList.remove("disable");
    deleteBtn.forEach((e) => {
      e.classList.remove("disable");
    });

    changeBtn.forEach((e) => {
      e.classList.remove("disable");
    });
  }
};

//  fungsi mendapatkan tanggal dan bulan lokal
const getDateNow = () => {
  const date = new Date();
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const day = date.getDate();
  const monthName = monthNames[date.getMonth()];
  dateText.innerText = `${day} ${monthName}`;
};

getDateNow();
