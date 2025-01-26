function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");
// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );
// currentLink.classList.add('current');

const ARE_WE_HOME = document.documentElement.classList.contains('home');
let pages = [
  { url: '', title: 'Home' },
  { url: 'contact/', title: 'Contact' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/averma205/', title: 'GitHub'}
];

let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
  let url = p.url;
  let title = p.title;
  url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }
  else {
    a.target='_blank';
  }
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">Theme:
		<select name="theme" id="theme">
  			<option value="light dark">Automatic</option>
  			<option value="light">Light</option>
  			<option value="dark">Dark</option>
		</select>
	</label>`
);
let select = document.querySelector('.color-scheme');
select.addEventListener('input', function(event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
  select.value = event.target.value;
});
console.log(localStorage.getItem('colorScheme'));
if ('colorScheme' in localStorage) {
  document.documentElement.style.setProperty('color-scheme', localStorage.getItem('colorScheme'));
  select.value = localStorage.getItem('colorScheme');
}