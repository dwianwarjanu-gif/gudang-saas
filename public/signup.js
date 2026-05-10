console.log("Signup JS loaded");

window.onload = () => {

 const btn = document.getElementById("createStore")

 btn.addEventListener("click", async () => {

  console.log("Button clicked")

  const storeName = document.getElementById("storeName").value
  const subdomain = document.getElementById("subdomain").value
  const email = document.getElementById("email").value

  const res = await fetch("/api/signup",{
   method:"POST",
   headers:{
    "Content-Type":"application/json"
   },
   body: JSON.stringify({
    storeName,
    subdomain,
    email
   })
  })

  const json = await res.json()

  alert(json.message || json.error)

 })

}
