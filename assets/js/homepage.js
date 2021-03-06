let userFormEl = document.querySelector('#user-form')
let nameInputEl = document.querySelector('#username')
let repoSearchTerm = document.querySelector('#repo-search-term')
let repoContainerEl = document.querySelector('#repos-container')
let languageButtonsEl= document.querySelector('#language-buttons')

function formSubmitHandler(e) {

    e.preventDefault()
    let username = nameInputEl.value.trim()
    if (username) {
        getUserRepos(username)
        nameInputEl.value = ""
    } else {
        console.log("Please enter a GitHub username.")
    }
}

function getUserRepos(user) {

    let apiUrl = "https://api.github.com/users/" + user + "/repos"
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            displayRepos(data, user)
          });
        } else {
          alert("Error: GitHub User Not Found")
        }
      })
      .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        console.log(error)
        alert("Unable to connect to GitHub")
      })
}

function displayRepos(repos, searchTerm) {
    
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
    
        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName)
        repoEl.classList = "list-item flex-row justify-space-between align-center";
    
        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
    
        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
        statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
        statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);
    
        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
}

function getFeaturedRepos(language) {

  let apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues"
  fetch(apiUrl).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        displayRepos(data.items, language)
      })
    } else {
      alert("Error: " + response.statusText)
    }
  })
}

function buttonClickHandler(e) {
  
  let language = event.target.getAttribute("data-language")
  if(language) {
    getFeaturedRepos(language)
    repoContainerEl.textContent = "";
  }
}

userFormEl.addEventListener("submit", formSubmitHandler)
languageButtonsEl.addEventListener("click", buttonClickHandler);