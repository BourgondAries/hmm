use std;
use std::cmp::Ordering;
use std::io::Read;
use std::rc::Rc;
use toml;

fn file_to_string(filename: &std::path::PathBuf) -> Option<String> {
	let file = std::fs::File::open(filename);
	let mut file = match file {
		Ok(file) => file,
		Err(err) => {
			error!("Unable to open file: {:?}", err);
			return None;
		}
	};
	let mut string = String::new();
	match file.read_to_string(&mut string) {
		Ok(bytes) => {
			trace!("Read {} bytes from file", bytes);
		}
		Err(err) => {
			error!("Unable to read file: {:?}", err);
			return None;
		}
	}
	Some(string)
}

pub fn build_bubble_tree() -> () {
	struct Chapter {
		title: String,
		content: String,
		parents: Vec<Rc<Chapter>>,
	}

	impl Chapter {
		fn new() -> Chapter {
			let vector =  Vec::<Rc<Chapter>>::new();
			Chapter {
				title: String::new(),
				content: String::new(),
				parents: vector,
			}
		}
	}

	struct ChapterRaw {
		title: String,
		content: String,
		parents: Vec<String>,
	}

	impl Eq for ChapterRaw {}
	impl PartialEq<ChapterRaw> for ChapterRaw {
		fn eq(&self, other: &ChapterRaw) -> bool {
			self.title == other.title
		}

		fn ne(&self, other: &ChapterRaw) -> bool {
			self.title != other.title
		}
	}

	impl Ord for ChapterRaw {
		fn cmp(&self, other: &ChapterRaw) -> Ordering {
			self.title.cmp(&other.title)
		}
	}

	impl PartialOrd<ChapterRaw> for ChapterRaw {
		fn partial_cmp(&self, other: &ChapterRaw) -> Option<Ordering> {
			self.title.partial_cmp(&other.title)
		}
	}

	fn get_str_from_table(table: &mut toml::Table, path: &str, missing: String, wrong: String) -> String {
		if let Some(string) = table.remove(path) {
			if let toml::Value::String(string) = string {
				string
			} else {
				warn!("{}", wrong);
				wrong
			}
		} else {
			warn!("{}", missing);
			missing
		}
	}

	fn get_vec_str_from_table(table: &mut toml::Table, path: &str, missing: String, wrong: String) -> Vec<String> {
		if let Some(mut array) = table.remove(path) {
			if let toml::Value::Array(ref mut array) = array {
				let mut vector = vec![];
				vector.reserve_exact(array.len());
				while let Some(element) = array.pop() {
					if let toml::Value::String(string) = element {
						vector.push(string);
					} else {
						error!("Could not convert to String, never expected. Internal TOML error or other tinkering going on");
					}
				}
				vector
			} else {
				warn!("{}", wrong);
				vec![wrong]
			}
		} else {
			warn!("{}", missing);
			vec![missing]
		}
	}

	let mut chapters: Vec<_> = vec![];
	match std::fs::read_dir("tree") {
		Ok(read) => {
			for file in read {
				match file {
					Ok(entry) => {
						trace!("{:?}", entry.path());
						if let Some(string) = file_to_string(&entry.path()) {
							let mut parser = toml::Parser::new(&string);
							match parser.parse() {
								Some(ref mut table) => {
									trace!("Parsed a table");
									let title = get_str_from_table(table, "title",
										format!("MISSING TITLE: {:?}", entry.path()),
										format!("WRONG TITLE TYPE: {:?}", entry.path()));
									let content = get_str_from_table(table, "content",
										format!("MISSING CONTENT: {:?}", entry.path()),
										format!("WRONG CONTENT TYPE: {:?}", entry.path()));
									let parents = get_vec_str_from_table(table, "parents",
										format!("MISSING PARENTS: {:?}", entry.path()),
										format!("WRONG PARENTS TYPE: {:?}", entry.path()));

									chapters.push(Rc::new(ChapterRaw {
										title: title,
										content: content,
										parents: parents,
									}));
								}
								None => {
									error!("Unable to parse the toml file {:?}", entry.path());
									for error in &parser.errors {
										let (line, col) = parser.to_linecol(error.lo);
										error!("Error on line {}, column {}: {}",
											line, col,
											error.desc);
									}
								}
							}
						} else {
							error!("Could not get the file into a string");
						}
					}
					Err(err) => {
						error!("Could not get an entry: {:?}", err);
					}
				}
			}
		}
		Err(err) => {
			error!("Could not read tree directory: {:?}", err);
			error!("No point in continuing, aborting");
			std::process::exit(1);
		}
	};


}
