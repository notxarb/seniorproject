function NavagateTo(url)
{
  document.location.href = url;
}

function toggle_display(element_id)
{
  element = document.getElementById(element_id);
  element.style.display = element.style.display === 'none' ? '' : 'none';
}