// Write your code here...
import Http from "./Http";

const filesListContainer = document.querySelector(".filesList > table > tbody");
const fileInput = document.querySelector("input[name=fileToUpload]");
const uploadBtn = document.querySelector("#uploadFileBtn");
const abortBtn = document.querySelector("#abortBtn");
const http = new Http("http://localhost:8080/api");

const Row = (filename, size) => `<tr>
  <td>${filename}</td>
  <td>${size}Kb</td>
</tr>`;

const renderList = async function () {
  try {
    const response = await http.get("/list");
    const json = await response.json();
    const listOfFiles = json.map((e) => Row(e.file, e.size));
    filesListContainer.innerHTML = listOfFiles.join("");
  } catch {
    alert("There was an error fetching a list of files");
  }
};

renderList();

uploadBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  let fileToUpload = fileInput.files;
  if (fileToUpload.length !== 0) {
    try {
      const { abort, send } = await http.upload("/upload", fileToUpload[0]);
      abortBtn.addEventListener("click", () => abort());
      await send();
    } catch (err) {
      console.log(err);
    } finally {
      fileInput.value = "";
      renderList();
    }
  } else {
    alert("Please choose a file");
  }
});
