// GAME: 
// Inital screen load:
window.onload = () => {
    const start_button  = document.getElementById("start_button")
    start_button.addEventListener("click", show_game)
    const how_to = document.getElementById("how_to")
    how_to.addEventListener("click", display_directions )
}

// Directions about how to play:
const display_directions = () => {
    const directions = "When you press \"start\" you will be able to input an 8, a 10, or a 12.<br> Depending on which, you will have either 3, 5, or 8 seconds to memorize the images.<br> Then depending on how many images you chose, you will have either 120 seconds, 150 seconds or 180 seconds respectively, to get as many matches as possible.<br> Good luck!"
    document.getElementById("welcome").innerHTML = directions
}

// Function: --> Gameboard
var matches = new Map()
var n = null
var game_time = 0
const show_game = () => {
    // Get rid of the dialog box:
    document.getElementById("dialog_container").innerHTML = ""
    // Get user input:
    n = prompt("How many tiles would you like (8, 10, or 12)?")
    // Start Image visibility timer and hide the images:
    hide_all_images(n) 
    // Put all of the images in an array:
    var ordered_images = []; 
    for( i = 1; i <= n ; i++){ 
        temp = [0,0]
        matches.set(i, temp)
        for(j = 1; j <= 2 ; j++){
             // Add the images to the array
            ordered_images = [...ordered_images, "<img src='./images/match"+i+""+j+".webp'/>"]
            // Add pairs of images (matches) to map:
            if(j == 1) {
                temp = matches.get(i)
                temp[0] = "<img src='./images/match"+i+""+j+".webp'/>"
                matches.set(i, temp)
            }
            else{
                temp = matches.get(i)
                temp[1] = "<img src='./images/match"+i+""+j+".webp'/>"
                matches.set(i, temp)
            }
        }
    }
    // Shuffle the images
    ordered_images = shuffle(ordered_images)
    // Append the images to output
    output = ""
    for( i = 0 ; i < ordered_images.length; i++)
        output += ordered_images[i] 
    // Write the images to the UI 
    document.getElementById("show_game").innerHTML = output
    
    // Set gameplay timer: 
    if(n == 8) game_time = 120 + 3 // Game timer max = 120 seconds + 3 sec of viewing
    else if(n == 10) game_time = 150  + 5 // 150 seconds
    else if(n == 12) game_time = 180 + 8 // 180 seconds
    const curr_time = setInterval(()=>{
        document.getElementById("show_timer").innerHTML = "<h1>Timer: " + game_time
        if(game_time <= 0){
             document.getElementById("show_timer").innerHTML = ""
             document.getElementById("show_game").innerHTML = " <h1>Your Score: " + game_score + "!<br>Great Job!</h1><center><img id='winner' src='./images/winner.webp'></center>"
             clearInterval(curr_time)
        } 
        game_time--
    }, 1000)
}

// Variables that need to persist more than on click:
var checked_boxes = []
var checked_ids = []
var game_score = 0
const handle_click = async (id) => {
    // Fetch original image from map using the html "id" attribute
   await document.getElementById(id).setAttribute("src",image_map.get(id))
   // Check if the images in checked_matches are a match
   checked_boxes = [...checked_boxes, image_map.get(id)] 
   checked_ids = [...checked_ids, id]
   if(checked_boxes.length == 2 ){
    // Theyve already selected 2 images, disable clicking:
    await document.getElementsByTagName("main")[0].setAttribute("class","disable_clicks")
    for(let [k,v] of matches){
        let s = v[0] +" "+ v[1]
        // If images are a match, hide them and increase score
        // Dont let the person get a point from double clicking same picture *
        if((s.includes(checked_boxes[0]) && s.includes(checked_boxes[1])) && (checked_boxes[0] != checked_boxes[1])){
            game_score += 1
            // If they win, end game early and clear the other elements:
            if(game_score == n){
                game_time = -1
                document.getElementById("show_score").innerHTML = ""
                document.getElementsByTagName("main")[0].setAttribute("class"," ")
                document.getElementById("show_game").innerHTML = " <h1>Your Score: " + game_score + "!<br>Great Job!</h1><center><img id='winner' src='./images/winner.webp'></center>"
                return
            }
            hide_image(checked_ids)
            checked_ids =[]
            checked_boxes = []
            // Show updated score
            document.getElementById("show_score").innerHTML = "<h1>Current Score: "+game_score+"</h1>"
            // Resume clicking:
            setTimeout(()=>{
                document.getElementsByTagName("main")[0].setAttribute("class","")
            },1500)
            // Break out of function
            return 
        }
    }
    // Other wise you have 2 images selected that dont match:
    const change_to_stars = setTimeout(()=>{
        document.getElementById(checked_ids[0]).setAttribute("src", "./images/stars.webp")
        document.getElementById(checked_ids[1]).setAttribute("src", "./images/stars.webp")
        checked_boxes = []
        checked_ids = []
        // Resume clicking
        document.getElementsByTagName("main")[0].setAttribute("class","")
    },1000)
   }
}

 // Helper Function:: --> Hide all images
 var image_map = new Map()
 const hide_all_images = (n) => {
     var time = 0; 
     var limit = 0;
     // The allowed ammount of time user sees images before flipping over tiles
     if(n == 8) limit = 3
     else if(n == 10) limit = 5
     else if(n == 12) limit = 8
     const timer = setInterval(() => {
         time ++
         if(time > limit){ // When the timer is up, hide the images:
             let arr = document.getElementsByTagName("img")
             for(i = 0 ; i < arr.length ; i++) {
                 // Set up a map for original image retrieval
                 image_map.set(i , arr[i].getAttribute("src")) 
                 arr[i].setAttribute("src", "./images/stars.webp") // Hide the images
                 arr[i].setAttribute("id", i) // Give the images id's [1-n] 
                 // Set the click function for each image with its id
                 arr[i].setAttribute("onclick", "handle_click("+(i)+")") 
             } 
             clearInterval(timer)
             time = ""
         }
     }, 1000);
 }

// Helper Function:: array[unshuffled] -> array[shuffled]
const shuffle = (arg) => {
    for(i = 0; i < arg.length; i++){ // For each element in arr
      j = (Math.floor(Math.random() * arg.length)) // New random index
      curr = arg[i]  
      arg[i] = arg[j] // Swap current index with random index
      arg[j] = curr
    } 
    return arg;
}

// Helper Function:: array["ids"] --> changes images for those id's
const hide_image = (arg) => {
    const timer = setTimeout(() => {
        for( i = 0 ; i < arg.length; i++)
         document.getElementById(arg[i]).setAttribute("class","hide_image")
    }, 900);
}

  