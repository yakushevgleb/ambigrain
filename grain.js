thispatcher = this.patcher;
pitchshift = thispatcher.getnamed("pitchshift");
ambiencode = thispatcher.getnamed("ambiencode");
function msg_int(polyIndex) {
	for (var index = 0; index <= 55; index++) {
		thispatcher.disconnect(pitchshift, 0, ambiencode, index);
	};
	if (polyIndex >= 0) {
		thispatcher.connect(pitchshift, 0, ambiencode, polyIndex - 1);
	};
}