from pypdf import PdfReader


class Resume:

    def __init__(self, file_path):
        self.file_path = file_path
        self.resume_str = ''

    def read(self):
        if self.resume_str == '':
            reader = PdfReader(self.file_path)
            for page in reader.pages:
                self.resume_str += page.extract_text()

        return self.resume_str