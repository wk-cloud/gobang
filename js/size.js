window.addEventListener('load', function () {
	const chess = document.querySelector('.chess');
	const getWindowInfo = () => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		if (width <= 1200) {
			chess.style.width = 400 + 'px';
			chess.style.height = 400 + 'px';
		} else {
			chess.style.width = 600 + 'px';
			chess.style.height = 600 + 'px';
		}
	};
	window.addEventListener('resize', getWindowInfo);
});