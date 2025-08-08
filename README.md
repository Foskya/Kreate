# Kreate
Unleash your creativity with this new drawing app for Kindle.
You will finally be able to sketch in your device and design your own masterpieces.

See the `examples` page to see what has been done.
If you draw something you are proud of and would like me to share it, let me known and I will add it to the folder 😊


# Challenges
One huge challenge when it comes to programming a drawing app in Kindle is that the `kindle.gestures` object is able to detect only taps and at best the general direction of swipes (that is: `up`, `down`, `left`, `right`) but not the exact directions or ending point.
This means that it is impossible to draw by simply dragging your finger on the screen.

To make up for this I’ve set up several drawing modes, where it is possible to decide what you want to draw (a dot, a line or a curve -*yes curves too*)

I’ve programmed it in a way that it should adapt to any screen, regardless of model or size, but if you have any problem with the sizing please let me know and I'll see what I can do.


## Installation
1.  **PREREQUISITES:** Your Kindle must be **jailbroken** with the **Universal Hotfix** and **Winterbreak** installed. 
2.  Insert the folder `/kreate` in the `/documents` folder on your Kindle's main storage partition (from root it would be: `/mnt/us/documents`)
3.  That's it. Now you can run it from the homepage.

## Future Implementations
* Add an icon
* Generally improve usability and make it less clumsy
* Button to download your *horro* ahem ahem **masterpieces**
* Generator of the drawing's QR code
* `Geometric Shapes` mode (circles, rectangles, triangles, etc)
* `Fill Color` mode
* dot size indicator
* `Back` Button
* Better UI (use more images instead of words)
* Improve top bar (making it show the current mode and color)

## acknowledgements 
Big thanks to [@penguins](https://github.com/polish-penguin-dev/) that developed Illusion (the kindle webapp framework this project is based upon) and helped me wrap my head around the `kindle.gestures` object. 


