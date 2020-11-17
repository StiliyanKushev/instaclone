# Instaclone

"Instaclone" is my take on creating a somewhat close to the original copy of the famous app "Instagram" using React + NodeJS.

## Preview (note: file browser popup didn't get recorded)

![demogif](ReadmeAssets/demo.gif)

## Libraries and techniques used

- [React Semantic UI](https://react.semantic-ui.com)

  Used for speeding up the development of my app. It has a similar style to Instagram, and it's also very responsive, and easy to set-up.

- [React-Virtualized](https://github.com/bvaughn/react-virtualized)

  I wanted my project to be as efficient as possible, when it comes to loading lots of data while scrolling. Like the original, I'm using a library to help "cache" and "virtualize" my components using clever ways of rendering only things that are needed.

- [React Router](https://reactrouter.com/)

  Navigating through the many routes of my app is done seamlessly using react router. Easy to set-up and powerful way to help the user get wherever he wants.

- [SocketIO](https://socket.io/)

  When creating the project, I imagined having some type of chat available to the user, and some real time communication to other profiles. Using sockets, for managing chat messages and rooms was nothing more than easy.

- [Express](https://expressjs.com/)

  Obviously, my app needed to handle a good amount of calls, for performing multiple tasks such as creating posts, commenting, saving, you name it. And what a better way to construct my backend then using the almighty express.

- [Mongoose](https://mongoosejs.com/)

  When it comes to saving stuff in a database, I went with mongoose. It has a very simple and straightforward implementation, and I'm also very familiar with it. 
