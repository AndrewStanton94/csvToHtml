let makeList = (reqs, sep = "\n", tag = "ul", itemTags = "li") =>
  `<${tag}>\n${[
    ...reqs.split(sep).map(r => `\t<${itemTags}>${r}</${itemTags}>`)
  ].join("\n")}\n</${tag}>`;

const makeCourseLink = (code, text, year=2019) => `<a href="https://www.registryhub.port.ac.uk/entry_requirements/?course_code=${code}&year=${year}" target="_blank" title="Opens in a new tab">${text}</a>`
const requirementsLink = (code) => `\n<p>${makeCourseLink(code, 'See the other qualifications we accept')}</p>`;
const languageLink = (code) => `\n<p>${makeCourseLink(code, 'See alternative English language qualifications')}</p>`;

module.exports = {
    makeList,
    makeCourseLink,
    requirementsLink,
    languageLink
}
