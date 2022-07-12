// PAYROLL:  
const show_table = () => {
    total_staff = [] // Init. the "books"
    // Run until the user exits by pressing enter or entering -1:
    while(true){
        var name = prompt("What is your name? (Enter -1 to view results)") // Init users name
        if(name.includes("-1") || name.length <=0 ) 
            break;
        var worked = prompt("How many hours did you work this week?") // Init users total hours worked 
        var money = worked  * 15 // Calculate pay
        if (worked > 40){ // If needed, calculate overtime:
            let overtime = worked - 40
            let temp_worked = 40
            money = (overtime * (15 * 1.5) + (15 * temp_worked) )
        } // Create an object containing all of the information about the user
        var employee = {"name": name, "worked" : worked, "money" : money}
        // Place the employee object into the "books"
        total_staff = [...total_staff, employee]
    }
    // Create a table
    var table = "<table><tr><th>Name</th><th>Hours</th><th>NET</th></tr>"
    labor_cost = 0
    // Add each employee's details to the table
    for(i = 0; i < total_staff.length; i++){
        table += "<tr><td>"+(i+1)+". "+total_staff[i]["name"]+'</td><td>' + total_staff[i]["worked"]+'</td><td>$ '+ total_staff[i]["money"] + '</td></tr>'
        labor_cost += total_staff[i]["money"]
    }
    // Append the total ammount spent amongst all of the employees
    table += "<tr><td><b>Labor Cost</b></td><td></td><td><b>$ " + labor_cost + "</b></td></tr>"
    // Show table to the user:
    document.getElementById("table_container").innerHTML = table
}



// GAME: 
// Function: --> Gameboard
var checked = null;  
var matches = new Map()
const show_game = () => {
    const n = prompt("How many tiles would you like (8, 10, or 12")
    checked = n;
    show_timer(n) // Start time once shuffled
    var ordered_images = []; // Init array for images
    for( i = 1; i<=n ; i++){ // While i < n; 
        temp = [0,0]
        matches.set(i, temp)
        for(j = 1; j <= 2 ; j++){ // Add the images to the array
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
    document.getElementById("show_game").innerHTML = output;
    var game_time = 0;
    if(n == 8) game_time = 12000
    else if(n == 10) game_time = 150000
    else if(n == 12) game_time = 180000
    const game_timer = setTimeout(()=>{
        document.getElementById("show_game").innerHTML = " <h1>Your Score: " + game_score + "!<br>Great Job!</h1><center><img id='winner' src='./images/winner.webp'></center>";
    }, game_time)

}

// Function: array[unshuffled] -> array[shuffled]
const shuffle = (arg) => {
    for(i = 0; i < arg.length; i++){ // For each element in arr
      j = Math.floor(Math.random() * arg.length); // New random index
      curr = arg[i]  
      arg[i] = arg[j] // Swap current index with random index
      arg[j] = curr
    } 
    console.log(arg.length)
    return arg;
  }

 // Function: --> UI timer
var image_map = new Map()
const show_timer = (n) => {
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
        document.getElementById("show_timer").innerHTML = "<h1>"+time+"</h1>";
    }, 1000);
}

// Variables need to persist more than on click:
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
    await document.getElementsByTagName("body")[0].setAttribute("class","disable_clicks")
    for(let [k,v] of matches){
        let s = v[0] +" "+ v[1]
        // If images are a match, hide them and increase score
        if(s.includes(checked_boxes[0]) && s.includes(checked_boxes[1])){
            hide_image(checked_ids)
            checked_ids =[]
            checked_boxes = []
            game_score += 1
            // Show updated score
            document.getElementById("show_score").innerHTML = "<h1>Current Score: "+game_score+"</h1>";
            // Resume clicking:
            await document.getElementsByTagName("body")[0].setAttribute("class","")
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
        document.getElementsByTagName("body")[0].setAttribute("class","")
    },1500)
   }
}

const hide_image = (arg) => {
    const timer = setTimeout(() => {
        for( i = 0 ; i < arg.length; i++)
         document.getElementById(arg[i]).setAttribute("class","hide_image")
    }, 1500);
}

  