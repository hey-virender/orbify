export default function handleOutsideClick(ref, callback) {
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback();  // Execute the callback when a click is detected outside
    }
  };

  // Attach the event listener for clicks outside the element
  document.addEventListener('mousedown', handleClickOutside);

  // Cleanup the event listener when no longer needed
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}