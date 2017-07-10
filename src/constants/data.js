export const TESTIMONIALS = [
  {
    name: "Luuk",
    company: "Blog Society",
    image: require("../images/testimonials/luuk.jpg"),
    message:
      "Within a minimum amount of time, we arranged that our platform - customized to the company's needs - could be build within a month. Outsourcing development has never been this easy."
  },
  /*{
        name: 'Angella',
        company: 'Ugandan Developer',
        image: require("../images/testimonials/angella.jpg"),
        message: "As a developer, Tunga allows me to work on interesting projects from around the globe, and build great working relationships with clients using tools like Slack",
        is_developer: true
    },*/
  {
    name: "Michiel",
    company: "Gaspedaal",
    position: "Product Owner",
    image: require("../images/testimonials/michiel.jpg"),
    message:
      "The developers from Tunga do have knowledge, quickly anticipate on problems and are flexible in sharing responsibilities. Occasionally they send funny giphies through Slack, so they also have a sense of humor.",
    wizard: true
  },
  {
    name: "Karl",
    company: "Statehill",
    position: "Founder",
    image: require("../images/testimonials/karl.png"),
    message:
      "We were pleasently surprised with how easy it was to get the right person onboard and the Ugandan developer we worked with professionally executed the project in a satisfactory manner.",
    wizard: true
  },
  {
    name: "Marion",
    company: "Blog Society",
    position: "Product Owner",
    image: require("../images/testimonials/marion.jpg"),
    message:
      "We are not developers ourselves and we are very happy with the high level of customer service and the proactive stance of the Tunga people, to help us bring our ideas to life.",
    wizard: true
  },
  {
    name: "Annette",
    company: "Yoohcan",
    position: "Product Owner",
    image: require("../images/testimonials/annette.jpg"),
    message:
      "I have to admit I was a bit sceptic at first, but the quality was good and the process was smooth. And at these rates using Tunga is a no-brainer for us.",
    wizard: true
  }
];

export function getClientTestimonials(max = 0) {
  var client_testimonials = [];
  TESTIMONIALS.map(item => {
    if (item.wizard) {
      client_testimonials.push(item);
    }
  });
  return client_testimonials.slice(0, max ? max : TESTIMONIALS.length);
}
