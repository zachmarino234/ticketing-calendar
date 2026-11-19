# Ticketing Calendar

Goal: A Typescript-based Calendar for theatrical productions that can attach to APIs from all major ticketing providers.

Currently, this project is a proof of concept, but I plan to turn it into either a library or plugin that will be compatible with Typescript-based code platforms like Next.js. I also hope to have a headless version that can adapted as well.

## Installation

To install and run this project, clone the project, run ```npm install``` and ```npm run dev```. The code has a function for fetching data from TicketTailor, though I am currently using a mock endpoint for simplicity. Some platforms have difficult to access APIs since you need a show to pull from and they don't have free tiers.

## Current Providers

| Provider | Implemented?
| --- | --- |
| TicketTailor | ✅ |
| Line-Up Ticketing | Planned |
| EventBrite | Planned |
| AudienceView | Planned |
| TodayTix | Planned |
| Spektrix | Planned |
| VenueTix | Planned |
| Telecharge | Planned |

### AI Use
I built this project with assistance from Claude, as well as autofill from CoPilot. I used Claude for early research on ticketing APIs, to talk through architecture, to learn new concepts, and to help debug. Some starter code (the Vite proxy config, initial type definitions and example tests) began as AI suggestions that I adapted. I wrote the transform logic, the calendar component, its utilities and the test suite, and made the design and architecture decisions. I am using this project as an opportunity to write cool that will be useful for future projects, as well as learn and reinforce software development principles :)
