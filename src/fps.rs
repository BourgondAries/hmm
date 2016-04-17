use fps_counter::FPSCounter;
use once_in::OnceIn;

pub struct Fps {
	fps: FPSCounter,
	per: OnceIn
}

impl Fps {
	pub fn new() -> Fps {
		Fps {
			fps: FPSCounter::new(),
			per: OnceIn::new(20)
		}
	}

	pub fn count_and_report(&mut self) {
		let fps = self.fps.tick();
		self.per.exe(|| {
			trace!("fps: {}", fps);
		});
	}
}

impl Default for Fps {
	fn default() -> Fps {
		Fps::new()
	}
}
