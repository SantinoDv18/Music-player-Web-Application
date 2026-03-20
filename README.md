# **Music Player Web App**

## **Description**

Web-based music player application that works with locally stored audio files managed manually through the Django admin panel.

The system allows music playback directly from the browser using a JavaScript-based frontend, which communicates with the backend through JSON data.

---

## **Features**

### **Version Alpha 0.0.1**

* Music playback from the frontend  
* Play / Pause controls  
* Previous / Next track navigation  
* Automatic loop when reaching the end of the playlist  
* Frontend-backend communication via JSON

### **Version Alpha 0.0.2**

* Random (shuffle) playback  
* Loop mode (repeat playlist)  
* Volume control

### **Version Alpha 0.0.3 (Current)**

* Dynamic playlist table display
* Expandable/collapsible playlist (show 5 tracks initially, expand to see more)
* Selective column display (shows only Title and Artist)
* Active track highlighting in the playlist
* Automatic playlist expansion when playing a hidden track
* Responsive design for different screen sizes
* Smooth animations and transitions

---

## **Technologies Used**

* **Backend:** Django  
* **Frontend:** HTML, CSS, JavaScript  
* **Communication:** JSON

---

## **Installation and Setup**

1. Clone the repository:  

   `git clone https://github.com/SantinoDv18/Music-player-Web-Application.git`

   `Music-player-Web-Application.git`

2. Create a virtual environment:  
   
   `python -m venv venv`
   
   `source venv/bin/activate  \# Linux / Mac  `
   
   `venv\Scripts\activate     \# Windows  `
   
3. Install dependencies: `pip install \-r requirements.txt`

4. Run the development server: `python manage.py runserver`


  
---

## **Preview**

![][image1]  
---

## **Project Status**

🚧 In development (Alpha)

---

## **Future Improvements**

* Improved UI/UX design
* Search and filter functionality for playlist
* Favorites/Bookmarks system
* Automatic file upload system
* Better state management for the player
* Dark mode theme
* Keyboard shortcuts
* Application deployment
* User accounts and personalized playlists

---

## **Author**

SantinoDv18

---
[image1]: ./assets/preview.png