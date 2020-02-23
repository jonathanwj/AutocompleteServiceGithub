# AutocompleteServiceGithub

## Getting Started

There are three different ways to start a local development server.
- **npm** (requires nodejs and npm)
- **docker-compose** (requires docker-compose and docker)
- **docker** (requires docker)

Once the development server has started you can go to [localhost:3000](http://localhost:3000) to use the autocomplete service

Run the commands below in order for your method of your choice in the project root directory (The project root directory contains both `frontend/` and `backend/` directories)

*Note:* The installation of node_modules and build process might take about 2-5 minutes.

### npm
1. `npm install`
3. `npm start`

### docker-compose
1. `docker-compose up --build`

### docker
1. `docker build -t autocompleteservicegithub .`
2. `docker run -it -p 3000:3000 -p 3001:3001 --rm autocompleteservicegithub`
