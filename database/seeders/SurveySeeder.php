<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Question;
use App\Models\Answer;

class SurveySeeder extends Seeder
{
    private function answers(array $items): array
    {
        return array_map(fn($text, $i) => ['text' => $text, 'order' => $i + 1], $items, array_keys($items));
    }

    private function likert5(array $labels = ['Not at all', 'Very little', 'Some', 'A lot', 'Very much']): array
    {
        return $this->answers($labels);
    }

    private function satisfactionScale5(): array
    {
        return $this->answers(['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied']);
    }

    private function agreementScale5(): array
    {
        return $this->answers(['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree']);
    }

    // Store question IDs for cross-referencing conditions
    private array $questionIds = [];

    public function run(): void
    {
        $categories = $this->getCategories();

        foreach ($categories as $catData) {
            $cat = Category::create([
                'title' => $catData['title'],
                'description' => $catData['description'],
                'order' => $catData['order'],
            ]);

            foreach ($catData['questions'] as $qData) {
                $q = Question::create([
                    'category_id' => $cat->id,
                    'text' => $qData['text'],
                    'type' => $qData['type'],
                    'required' => $qData['required'] ?? false,
                    'placeholder' => $qData['placeholder'] ?? '',
                    'help_text' => $qData['help_text'] ?? '',
                    'order' => $qData['order'],
                    'condition_question_id' => $qData['condition_question_id'] ?? null,
                    'condition_operator' => $qData['condition_operator'] ?? null,
                    'condition_value' => $qData['condition_value'] ?? null,
                ]);

                if (isset($qData['ref'])) {
                    $this->questionIds[$qData['ref']] = $q->id;
                }

                foreach ($qData['answers'] ?? [] as $aData) {
                    Answer::create([
                        'question_id' => $q->id,
                        'text' => $aData['text'],
                        'order' => $aData['order'],
                    ]);
                }
            }

            // Second pass: update condition references
            foreach ($catData['questions'] as $qData) {
                if (isset($qData['condition_ref'])) {
                    $refId = $this->questionIds[$qData['condition_ref']] ?? null;
                    if ($refId) {
                        Question::where('category_id', $cat->id)
                            ->where('text', $qData['text'])
                            ->update(['condition_question_id' => $refId]);
                    }
                }
            }
        }
    }

    private function getCategories(): array
    {
        return [
            // ── IDENTIFICATION AND CALL RECORD ──
            [
                'title' => 'Identification & Call Record',
                'description' => 'Please provide your identification details. All information will be kept strictly confidential.',
                'order' => 1,
                'questions' => [
                    ['text' => 'Region Graduated From', 'type' => 'display', 'placeholder' => 'Region XI', 'order' => 1],
                    ['text' => 'Name of Respondent', 'type' => 'text', 'placeholder' => 'Full name', 'order' => 2],
                    ['text' => 'Email', 'type' => 'text', 'placeholder' => 'email@example.com', 'order' => 3],
                    ['text' => 'Mobile No.', 'type' => 'text', 'placeholder' => '09XX XXX XXXX', 'order' => 4],
                    ['text' => 'Telephone No. (with area code)', 'type' => 'text', 'placeholder' => '(Area Code) / Number', 'order' => 5],
                    ['text' => 'Is your current address in the Philippines or abroad?', 'type' => 'radio', 'ref' => 'ADDR_LOC', 'answers' => $this->answers(['Philippines', 'Abroad']), 'order' => 6],
                    ['text' => 'Which country are you currently in?', 'type' => 'text', 'placeholder' => 'Country', 'condition_ref' => 'ADDR_LOC', 'condition_operator' => 'equals', 'condition_value' => 'Abroad', 'order' => 7],
                    ['text' => 'Urban/Rural', 'type' => 'radio', 'answers' => $this->answers(['Urban', 'Rural']), 'condition_ref' => 'ADDR_LOC', 'condition_operator' => 'equals', 'condition_value' => 'Philippines', 'order' => 8],
                    ['text' => 'Address', 'type' => 'text', 'placeholder' => 'Complete address', 'condition_ref' => 'ADDR_LOC', 'condition_operator' => 'equals', 'condition_value' => 'Philippines', 'order' => 9],
                    ['text' => 'Barangay', 'type' => 'text', 'placeholder' => 'Barangay', 'condition_ref' => 'ADDR_LOC', 'condition_operator' => 'equals', 'condition_value' => 'Philippines', 'order' => 10],
                    ['text' => 'Municipality', 'type' => 'text', 'placeholder' => 'Municipality', 'condition_ref' => 'ADDR_LOC', 'condition_operator' => 'equals', 'condition_value' => 'Philippines', 'order' => 11],
                    ['text' => 'Province', 'type' => 'text', 'placeholder' => 'Province', 'condition_ref' => 'ADDR_LOC', 'condition_operator' => 'equals', 'condition_value' => 'Philippines', 'order' => 12],
                    ['text' => 'Region', 'type' => 'text', 'placeholder' => 'Current region', 'condition_ref' => 'ADDR_LOC', 'condition_operator' => 'equals', 'condition_value' => 'Philippines', 'order' => 13],
                    ['text' => 'Geocode', 'type' => 'text', 'placeholder' => 'Geocode', 'condition_ref' => 'ADDR_LOC', 'condition_operator' => 'equals', 'condition_value' => 'Philippines', 'order' => 14],
                ],
            ],

            // ── BLOCK A: RESPONDENT'S BACKGROUND — Personal Information ──
            [
                'title' => "Respondent's Background — Personal Information",
                'description' => 'Personal information of the respondent.',
                'order' => 2,
                'questions' => [
                    ['text' => 'Birthday', 'type' => 'date', 'order' => 1],
                    ['text' => 'Age on last birthday', 'type' => 'number', 'placeholder' => 'Auto-calculated from birthday', 'order' => 2],
                    ['text' => 'Assigned Sex at Birth', 'type' => 'radio', 'answers' => $this->answers(['Male', 'Female', 'Intersex']), 'order' => 3],
                    ['text' => 'Gender', 'type' => 'radio', 'answers' => $this->answers(['Male', 'Female', 'Transgender', 'Non-Binary', 'Self-describe', 'Prefer not to say']), 'order' => 4],
                    ['text' => 'Religion', 'type' => 'radio', 'answers' => $this->answers(['None', 'Roman Catholic', 'Protestant', 'Iglesia ni Cristo', 'Islam', 'Born Again', 'Others (specify)']), 'order' => 5],
                    ['text' => 'Current marital status', 'type' => 'radio', 'ref' => 'A4', 'answers' => $this->answers(['Never married', 'Married', 'Living-in', 'Separated', 'Annulled', 'Divorced', 'Widowed']), 'order' => 6],
                    ['text' => 'Date of first marriage', 'type' => 'date', 'condition_ref' => 'A4', 'condition_operator' => 'in', 'condition_value' => '["Married","Annulled","Separated","Divorced","Widowed"]', 'order' => 7],
                    ['text' => 'Date started living together', 'type' => 'date', 'condition_ref' => 'A4', 'condition_operator' => 'in', 'condition_value' => '["Married","Annulled","Separated","Divorced","Widowed"]', 'order' => 8],
                    ['text' => 'Do you intend to get married in the future?', 'type' => 'radio', 'ref' => 'A7', 'answers' => $this->answers(['Yes', 'No']), 'condition_ref' => 'A4', 'condition_operator' => 'in', 'condition_value' => '["Never married","Living-in"]', 'order' => 9],
                    ['text' => 'At what age do you intend to get married?', 'type' => 'number', 'placeholder' => 'Age', 'condition_ref' => 'A7', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 10],
                    ['text' => 'Reason for not intending to get married', 'type' => 'text', 'placeholder' => 'Reason', 'condition_ref' => 'A7', 'condition_operator' => 'equals', 'condition_value' => 'No', 'order' => 11],
                ],
            ],

            // ── BLOCK A: Family Information ──
            [
                'title' => 'Family Information',
                'description' => 'Information about your family background and household.',
                'order' => 3,
                'questions' => [
                    ['text' => 'Do you still live with your parents?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'order' => 1],
                    ['text' => 'Number of Cars owned when in college', 'type' => 'number', 'placeholder' => '0', 'help_text' => 'Household items owned when you were in college', 'order' => 2],
                    ['text' => 'Number of Personal Computers', 'type' => 'number', 'placeholder' => '0', 'order' => 3],
                    ['text' => 'Number of Aircon units', 'type' => 'number', 'placeholder' => '0', 'order' => 4],
                    ['text' => 'Number of Component/Stereo sets', 'type' => 'number', 'placeholder' => '0', 'order' => 5],
                    ['text' => 'Number of Gas Ranges', 'type' => 'number', 'placeholder' => '0', 'order' => 6],
                    ['text' => 'Number of Washing Machines', 'type' => 'number', 'placeholder' => '0', 'order' => 7],
                    ['text' => 'Number of Refrigerator/Freezers', 'type' => 'number', 'placeholder' => '0', 'order' => 8],
                    ['text' => 'Number of VCRs', 'type' => 'number', 'placeholder' => '0', 'order' => 9],
                    ['text' => 'Number of CD/VCD/DVD Players', 'type' => 'number', 'placeholder' => '0', 'order' => 10],
                    ['text' => 'Number of Televisions', 'type' => 'number', 'placeholder' => '0', 'order' => 11],
                    ['text' => 'Number of Karaoke sets', 'type' => 'number', 'placeholder' => '0', 'order' => 12],
                    ['text' => 'Number of Landline Telephones', 'type' => 'number', 'placeholder' => '0', 'order' => 13],
                    ['text' => 'Number of Cellular Phones', 'type' => 'number', 'placeholder' => '0', 'order' => 14],
                    ['text' => 'Number of Radio/Radio Cassettes', 'type' => 'number', 'placeholder' => '0', 'order' => 15],
                    ['text' => "A12. Highest educational attainment of Father", 'type' => 'select', 'help_text' => 'Codes: No grade completed=00, Pre-school=01, Elementary=11-16, High School=21-24, College=31-47, Post-baccalaureate=51, Don\'t know=98', 'answers' => $this->answers(["No grade completed", "Pre-school", "Elementary Undergraduate", "Elementary Graduate", "High School Undergraduate", "High School Graduate", "Vocational/Technical", "College Undergraduate", "College Graduate", "Post-baccalaureate", "Don't know"]), 'order' => 16],
                    ['text' => "A12. Highest educational attainment of Mother", 'type' => 'select', 'answers' => $this->answers(["No grade completed", "Pre-school", "Elementary Undergraduate", "Elementary Graduate", "High School Undergraduate", "High School Graduate", "Vocational/Technical", "College Undergraduate", "College Graduate", "Post-baccalaureate", "Don't know"]), 'order' => 17],
                    ['text' => 'Number of siblings', 'type' => 'number', 'ref' => 'A13', 'placeholder' => '0 (if 0, skip to A15)', 'order' => 18],
                    ['text' => 'Siblings details (Name, Sex, Age, Highest Education, Currently Working) — from eldest to youngest, excluding yourself', 'type' => 'repeating_text', 'placeholder' => 'Name | Sex (M/F) | Age | Highest Education | Working (Yes/No)', 'help_text' => 'Enter details for each sibling', 'repeating_ref' => 'A13', 'condition_ref' => 'A13', 'condition_operator' => 'greaterThan', 'condition_value' => '0', 'order' => 19],
                    ['text' => "A14f. Respondent's birth order among siblings", 'type' => 'number', 'placeholder' => 'e.g. 2', 'condition_ref' => 'A13', 'condition_operator' => 'greaterThan', 'condition_value' => '0', 'order' => 20],
                ],
            ],

            // ── BLOCK A: Residential Change ──
            [
                'title' => 'Residential Change',
                'description' => 'Where you lived before and after college.',
                'order' => 4,
                'questions' => [
                    ['text' => 'How long have you been living continuously at current residence? (years)', 'type' => 'number', 'placeholder' => 'Years (if <1 year, enter 0)', 'order' => 1],
                    ['text' => 'Previous residence type', 'type' => 'radio', 'answers' => $this->answers(['City', 'Town proper/poblacion', 'Barrio/rural', 'Abroad']), 'order' => 2],
                    ['text' => 'How many years had you lived continuously at previous residence?', 'type' => 'number', 'placeholder' => 'Years (if <1 year, enter 0)', 'order' => 3],
                ],
            ],

            // ── BLOCK B: EDUCATION — College Program ──
            [
                'title' => 'Education — College Program',
                'description' => 'Information about the academic program you completed and considered.',
                'order' => 5,
                'questions' => [
                    ['text' => 'What baccalaureate program/degree did you complete?', 'type' => 'text', 'placeholder' => 'e.g. BS Computer Science', 'order' => 1],
                    ['text' => 'What program(s) did you consider before entering college?', 'type' => 'text', 'placeholder' => 'Program name(s)', 'order' => 2],
                    ['text' => 'Was your school Public or Private?', 'type' => 'radio', 'answers' => $this->answers(['Public', 'Private']), 'order' => 3],
                    ['text' => 'Was your school Sectarian or Non-sectarian?', 'type' => 'radio', 'answers' => $this->answers(['Sectarian', 'Non-sectarian']), 'order' => 4],
                    ['text' => 'Student ID number', 'type' => 'text', 'placeholder' => 'Student ID', 'order' => 5],
                    ['text' => 'Year started in program', 'type' => 'number', 'placeholder' => 'e.g. 2016', 'order' => 6],
                    ['text' => 'Year graduated', 'type' => 'number', 'placeholder' => 'e.g. 2020', 'order' => 7],
                    ['text' => 'Did you receive any honors/awards?', 'type' => 'text', 'placeholder' => 'e.g. Cum Laude, Dean\'s Lister, N/A', 'order' => 8],
                    ['text' => 'Reason for choosing your program', 'type' => 'checkbox', 'answers' => $this->answers(['Academic difficulty', 'Financial', 'Employment prospects', 'Personal preference', 'Others (specify)']), 'order' => 9],
                    ['text' => 'Would you have changed your course given what you know today?', 'type' => 'radio', 'ref' => 'B13', 'answers' => $this->answers(['Yes', 'No']), 'order' => 10],
                    ['text' => 'Which baccalaureate program would you have taken instead?', 'type' => 'text', 'placeholder' => 'Degree program', 'condition_ref' => 'B13', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 11],
                    ['text' => 'Would you have chosen another college/university?', 'type' => 'radio', 'ref' => 'B15', 'answers' => $this->answers(['Yes', 'No']), 'order' => 12],
                    ['text' => 'Which college/university would you have chosen?', 'type' => 'text', 'placeholder' => 'University name', 'condition_ref' => 'B15', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 13],
                    ['text' => 'Primary reason for choosing that university', 'type' => 'radio', 'answers' => $this->answers(['Better employment opportunities', 'Proximity', 'Prestige/Branding', 'Others (specify)']), 'condition_ref' => 'B15', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 14],
                    ['text' => 'Did you ever stop schooling for at least one semester?', 'type' => 'radio', 'ref' => 'B17', 'answers' => $this->answers(['Yes', 'No']), 'order' => 15],
                    ['text' => 'Reason for stopping', 'type' => 'radio', 'answers' => $this->answers(['Financial difficulty', 'Health reasons', 'Family obligations', 'Got someone pregnant', 'School penalties', 'Discipline']), 'condition_ref' => 'B17', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 16],
                ],
            ],

            // ── BLOCK B: Cost of College Education ──
            [
                'title' => 'Education — Cost of College',
                'description' => 'Information about the cost and financing of your college education.',
                'order' => 6,
                'questions' => [
                    ['text' => 'Average tuition & fees per semester (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 1],
                    ['text' => 'Number of semesters to complete degree', 'type' => 'number', 'placeholder' => 'e.g. 8', 'order' => 2],
                    ['text' => 'Average weeks per semester', 'type' => 'number', 'placeholder' => 'e.g. 18', 'order' => 3],
                    ['text' => 'Weekly allowance (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 4],
                    ['text' => 'Books, uniforms, supplies per semester (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 5],
                    ['text' => 'Residence while in college', 'type' => 'radio', 'answers' => $this->answers(['Own home', "Relatives' home", 'Dormitory', 'Boarding house', 'Others (specify)']), 'order' => 6],
                    ['text' => 'Did you pay rent?', 'type' => 'radio', 'ref' => 'B24', 'answers' => $this->answers(['Yes', 'No']), 'order' => 7],
                    ['text' => 'Monthly rental (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'condition_ref' => 'B24', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 8],
                    ['text' => 'Co-curricular expenses per semester (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 9],
                    ['text' => 'Extra-curricular expenses per semester (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 10],
                    ['text' => 'How was college education financed?', 'type' => 'checkbox', 'help_text' => 'Select all that apply', 'answers' => $this->answers(['Support from parents', 'Support from relatives', 'Self-support', 'Scholarship', 'Loans', 'Grants-in-aid', 'Others (specify)']), 'order' => 11],
                    ['text' => 'Primary source of financing', 'type' => 'text', 'placeholder' => 'Primary source', 'order' => 12],
                ],
            ],

            // ── BLOCK B: Professional / Licensure Exams ──
            [
                'title' => 'Education — Professional & Licensure Exams',
                'description' => 'Professional and government licensure examinations taken.',
                'order' => 7,
                'questions' => [
                    ['text' => 'Have you taken any professional/licensure exams?', 'type' => 'radio', 'ref' => 'B29', 'answers' => $this->answers(['Yes', 'No']), 'order' => 1],
                    ['text' => 'Name of exam', 'type' => 'text', 'placeholder' => 'e.g. CPA Board Exam', 'condition_ref' => 'B29', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 2],
                    ['text' => 'Month/Year taken', 'type' => 'text', 'placeholder' => 'MM/YYYY', 'condition_ref' => 'B29', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 3],
                    ['text' => 'Rating/Score (%)', 'type' => 'number', 'placeholder' => 'Score in %', 'condition_ref' => 'B29', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 4],
                    ['text' => 'Was it taken the first time?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'condition_ref' => 'B29', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 5],
                    ['text' => 'Other professional exams taken (list name, date, score)', 'type' => 'textarea', 'placeholder' => 'Exam name | Month/Year | Score', 'condition_ref' => 'B29', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 6],
                    ['text' => 'Have you taken any government examinations (Civil Service, TESDA, etc.)?', 'type' => 'radio', 'ref' => 'B35', 'answers' => $this->answers(['Yes', 'No']), 'order' => 7],
                    ['text' => 'Government exam name', 'type' => 'text', 'placeholder' => 'e.g. Civil Service Professional', 'condition_ref' => 'B35', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 8],
                    ['text' => 'Month/Year taken', 'type' => 'text', 'placeholder' => 'MM/YYYY', 'condition_ref' => 'B35', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 9],
                    ['text' => 'Rating/Score', 'type' => 'number', 'placeholder' => 'Score', 'condition_ref' => 'B35', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 10],
                    ['text' => 'Was it taken the first time?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'condition_ref' => 'B35', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 11],
                ],
            ],

            // ── BLOCK B: Graduate Studies & Trainings ──
            [
                'title' => 'Education — Graduate Studies & Trainings',
                'description' => 'Post-graduate education, internships, and training programs.',
                'order' => 8,
                'questions' => [
                    ['text' => 'Did you have an internship/OJT in college?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'order' => 1],
                    ['text' => 'Have you pursued graduate studies (Masters/Doctorate)?', 'type' => 'radio', 'ref' => 'B41a', 'answers' => $this->answers(['Yes', 'No']), 'order' => 2],
                    ['text' => 'Reason for taking undergraduate/postgraduate studies', 'type' => 'checkbox', 'answers' => $this->answers(['Good grades', 'Parent influence', 'Peer influence', 'Role model', 'Passion', 'Employment prospects', 'Prestige', 'Availability', 'Career advancement', 'Affordability', 'Overseas opportunity', 'CHED priority course', 'Others (specify)']), 'order' => 3],
                    ['text' => 'Have you taken any training/advanced studies after college?', 'type' => 'radio', 'ref' => 'B43', 'answers' => $this->answers(['Yes', 'No']), 'order' => 4],
                    ['text' => 'Courses/Training attended', 'type' => 'checkbox', 'answers' => $this->answers(['Professional skills', 'General skills (foreign languages, computer, management, etc.)', 'Others (specify)']), 'condition_ref' => 'B43', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 5],
                    ['text' => 'Reason for training', 'type' => 'checkbox', 'answers' => $this->answers(['Promotion', 'Professional development', 'Personal development', 'Others (specify)']), 'condition_ref' => 'B43', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 6],
                    ['text' => 'Who paid for the training?', 'type' => 'checkbox', 'answers' => $this->answers(['Respondent/family', 'Employer', 'Private/NGO', 'Public/State', 'International', 'Others (specify)']), 'condition_ref' => 'B43', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 7],
                    ['text' => 'Are there courses that would assist you in finding a job?', 'type' => 'radio', 'ref' => 'B47', 'answers' => $this->answers(['Yes', 'No']), 'order' => 8],
                    ['text' => 'What courses/programs?', 'type' => 'text', 'placeholder' => 'Course/program names', 'condition_ref' => 'B47', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 9],
                ],
            ],

            // ── BLOCK B: Skills Development & Curriculum Assessment ──
            [
                'title' => 'Education — Skills Development & Curriculum Assessment',
                'description' => 'Rate the extent to which your program developed the following skills. Scale: 1=Not at all, 2=Very little, 3=Some, 4=A lot, 5=Very much.',
                'order' => 9,
                'questions' => [
                    ['text' => 'Critical thinking', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 1],
                    ['text' => 'Problem-solving', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 2],
                    ['text' => 'Teamwork', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 3],
                    ['text' => 'Independent learning', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 4],
                    ['text' => 'Written communication', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 5],
                    ['text' => 'Spoken communication', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 6],
                    ['text' => 'Field knowledge', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 7],
                    ['text' => 'Work-related knowledge and skills', 'type' => 'radio', 'answers' => $this->likert5(), 'order' => 8],
                    ['text' => 'Overall: Did the curriculum enable you to compete in the labor market?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'order' => 9],
                    ['text' => 'What courses/trainings need to be included to compete in the labor market?', 'type' => 'checkbox', 'answers' => $this->answers(['Communication', 'IT', 'HR', 'Language', 'Occupational skills', 'CV writing', 'Internship', 'Others (specify)']), 'order' => 10],
                ],
            ],

            // ── BLOCK C: COLLEGE EXPERIENCE ──
            [
                'title' => 'College Experience',
                'description' => 'Your overall experience during college. Rate each item on a scale of 1 (Strongly disagree) to 5 (Strongly agree).',
                'order' => 10,
                'questions' => [
                    // C1. Learner Engagement
                    ['text' => 'I had a strong sense of belonging in the university', 'type' => 'radio', 'help_text' => 'Learner Engagement', 'answers' => $this->agreementScale5(), 'order' => 1],
                    ['text' => 'I felt well-prepared for my studies', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 2],
                    ['text' => 'I actively participated in school activities', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 3],
                    ['text' => 'I took on leadership roles', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 4],
                    ['text' => 'My religious affiliation was respected', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 5],
                    ['text' => 'I explored career options during college', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 6],
                    // C2. Teaching Quality
                    ['text' => 'Faculty explained concepts clearly', 'type' => 'radio', 'help_text' => 'Teaching Quality', 'answers' => $this->agreementScale5(), 'order' => 7],
                    ['text' => 'Faculty used real-world examples', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 8],
                    ['text' => 'Assignments were meaningful and relevant', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 9],
                    ['text' => 'Teaching was intellectually stimulating', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 10],
                    ['text' => 'Faculty provided useful feedback', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 11],
                    ['text' => 'Faculty were approachable', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 12],
                    ['text' => 'Faculty demonstrated subject mastery', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 13],
                    ['text' => 'Class time was used effectively', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 14],
                    // C3. Student Support Services
                    ['text' => 'Administrative staff were available and helpful', 'type' => 'radio', 'help_text' => 'Student Support Services', 'answers' => $this->agreementScale5(), 'order' => 15],
                    ['text' => 'Librarians were available and helpful', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 16],
                    ['text' => 'Counselors were available and helpful', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 17],
                    ['text' => 'Chaplains were available and helpful', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 18],
                    ['text' => 'Lab technicians were available and helpful', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 19],
                    ['text' => 'Research personnel were available and helpful', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 20],
                    // C4. Overall College Experience
                    ['text' => 'Learning was connected to real life', 'type' => 'radio', 'help_text' => 'Overall College Experience', 'answers' => $this->agreementScale5(), 'order' => 21],
                    ['text' => 'I experienced intellectual growth', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 22],
                    ['text' => 'I experienced personal growth', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 23],
                    ['text' => 'The college shaped my attitudes and values positively', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 24],
                ],
            ],

            // ── BLOCK D: EMPLOYMENT — Current Employment ──
            [
                'title' => 'Employment — Current Status',
                'description' => 'Information about your current employment status.',
                'order' => 11,
                'questions' => [
                    ['text' => 'Did you work or have a business/job during the past week?', 'type' => 'radio', 'ref' => 'D1', 'answers' => $this->answers(['Yes', 'No']), 'order' => 1],
                    ['text' => 'Although you did not work, do you have a job/business?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'condition_ref' => 'D1', 'condition_operator' => 'equals', 'condition_value' => 'No', 'order' => 2],
                    ['text' => 'Did you look for work or try to establish a business during the past week?', 'type' => 'radio', 'ref' => 'D3', 'answers' => $this->answers(['Yes', 'No']), 'condition_ref' => 'D1', 'condition_operator' => 'equals', 'condition_value' => 'No', 'order' => 3],
                    ['text' => 'Reason for not looking for work', 'type' => 'radio', 'answers' => $this->answers(['Tired/believe no work available', 'Awaiting results of application', 'Temporary illness/disability', 'Bad weather', 'Waiting for rehire/recall', 'Others (specify)']), 'condition_ref' => 'D3', 'condition_operator' => 'equals', 'condition_value' => 'No', 'order' => 4],
                    ['text' => 'When was the last time you looked for work?', 'type' => 'text', 'placeholder' => 'Month/Year', 'order' => 5],
                    ['text' => 'Are you available for work if offered?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'order' => 6],
                    ['text' => 'Are you willing to take up work?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No']), 'order' => 7],
                    ['text' => 'Occupation/Position', 'type' => 'text', 'placeholder' => 'Job title', 'order' => 8],
                    ['text' => 'Name of company/employer', 'type' => 'text', 'placeholder' => 'Company name', 'order' => 9],
                    ['text' => 'Company address', 'type' => 'text', 'placeholder' => 'Full address', 'order' => 10],
                    ['text' => 'Line of business/industry', 'type' => 'text', 'placeholder' => 'e.g. Manufacturing, BPO, Education', 'order' => 11],
                ],
            ],

            // ── BLOCK D: Employment Details ──
            [
                'title' => 'Employment — Details',
                'description' => 'Details of your current employment situation.',
                'order' => 12,
                'questions' => [
                    ['text' => 'How many months have you been in your current company?', 'type' => 'number', 'placeholder' => 'Months', 'order' => 1],
                    ['text' => 'Type of employment', 'type' => 'radio', 'answers' => $this->answers(['Permanent/Regular', 'Contractual', 'Casual', 'Seasonal', 'Self-employed', 'Others (specify)']), 'order' => 2],
                    ['text' => 'Normal working hours per week', 'type' => 'number', 'placeholder' => 'e.g. 40', 'order' => 3],
                    ['text' => 'Basis of payment', 'type' => 'radio', 'answers' => $this->answers(['Daily', 'Weekly', 'Bi-monthly', 'Monthly', 'Piece rate', 'Commission', 'Others (specify)']), 'order' => 4],
                    ['text' => 'Basic daily pay (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 5],
                    ['text' => 'Monthly income (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 6],
                    ['text' => 'Main reason for staying in current job', 'type' => 'radio', 'answers' => $this->answers(['Salary/Pay', 'Career growth', 'Related to field', 'Proximity to home', 'Benefits', 'Peer influence', 'Family influence', 'Others (specify)']), 'order' => 7],
                    ['text' => 'Do you have additional jobs/businesses?', 'type' => 'radio', 'ref' => 'D19', 'answers' => $this->answers(['Yes', 'No']), 'order' => 8],
                    ['text' => 'Additional jobs/businesses (describe)', 'type' => 'textarea', 'placeholder' => 'Describe your additional work', 'condition_ref' => 'D19', 'condition_operator' => 'equals', 'condition_value' => 'Yes', 'order' => 9],
                    ['text' => 'Total working hours across all jobs per week', 'type' => 'number', 'placeholder' => 'Total hours', 'ref' => 'Q10', 'order' => 10],
                    ['text' => 'Reason for working long hours (if >48 hrs/week)', 'type' => 'text', 'placeholder' => 'Reason', 'condition_ref' => 'Q10', 'condition_operator' => 'greaterThan', 'condition_value' => '48', 'order' => 11],
                    ['text' => 'Nature of current job', 'type' => 'radio', 'answers' => $this->answers(['Research (R&D)', 'Teaching/Training', 'Administrative', 'Technical', 'Clerical', 'Managerial', 'Sales', 'Production', 'Others (specify)']), 'order' => 12],
                    ['text' => 'Was your education required for this job?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'No', 'Not required but preferred']), 'order' => 13],
                ],
            ],

            // ── BLOCK D: First Job After College ──
            [
                'title' => 'Employment — First Job After College',
                'description' => 'Information about your first employment after graduating.',
                'order' => 13,
                'questions' => [
                    ['text' => 'What was your first job after college?', 'type' => 'text', 'placeholder' => 'Job title', 'order' => 1],
                    ['text' => 'What were your main tasks at that job?', 'type' => 'textarea', 'placeholder' => 'Describe your duties', 'order' => 2],
                    ['text' => 'Basis of payment in first job', 'type' => 'radio', 'answers' => $this->answers(['Daily', 'Weekly', 'Bi-monthly', 'Monthly', 'Piece rate', 'Commission', 'Others (specify)']), 'order' => 3],
                    ['text' => 'Basic daily pay at first job (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 4],
                    ['text' => 'Monthly income at first job (PHP)', 'type' => 'number', 'placeholder' => 'Amount in pesos', 'order' => 5],
                    ['text' => 'Main reason for accepting first job', 'type' => 'radio', 'answers' => $this->answers(['Salary/Pay', 'Career growth', 'Related to field of study', 'Proximity to home', 'Only job available', 'Peer influence', 'Family influence', 'Others (specify)']), 'order' => 6],
                    ['text' => 'Was your first job related to your college degree?', 'type' => 'radio', 'answers' => $this->answers(['Yes', 'Somewhat', 'No']), 'order' => 7],
                    ['text' => 'How long did it take to get your first job after graduation?', 'type' => 'radio', 'answers' => $this->answers(['Less than 1 month', '1 to 3 months', '4 to 6 months', '7 to 12 months', 'More than 1 year', 'Had a job before graduation']), 'order' => 8],
                ],
            ],

            // ── BLOCK D: Job History ──
            [
                'title' => 'Employment — Job History',
                'description' => 'Your complete employment history since graduation.',
                'order' => 14,
                'questions' => [
                    ['text' => 'Total number of jobs/employers since you started working', 'type' => 'number', 'placeholder' => 'Number of jobs', 'order' => 1],
                    ['text' => 'List your jobs BEFORE college (position, company, industry, duration)', 'type' => 'textarea', 'placeholder' => "Position | Company | Industry | Duration\ne.g. Cashier | SM | Retail | 6 months", 'order' => 2],
                    ['text' => 'List your jobs AFTER college (position, company, industry, duration, nature of work, basis of pay, income)', 'type' => 'textarea', 'placeholder' => "Position | Company | Industry | Duration | Nature | Pay basis | Monthly income\ne.g. Programmer | Accenture | IT | 2 years | Technical | Monthly | 25000", 'order' => 3],
                ],
            ],

            // ── BLOCK E: PERCEPTIONS / ATTITUDES / OPINIONS ──
            [
                'title' => 'Perceptions, Attitudes & Opinions',
                'description' => 'Your satisfaction and perceptions regarding your education and employment.',
                'order' => 15,
                'questions' => [
                    ['text' => 'E1. How satisfied are you with your college education overall?', 'type' => 'radio', 'answers' => $this->satisfactionScale5(), 'order' => 1],
                    ['text' => 'E2. How relevant is your college degree to your current work?', 'type' => 'radio', 'answers' => $this->answers(['Not at all', 'Very little', 'Somewhat', 'Mostly', 'Completely']), 'order' => 2],
                    ['text' => 'E3. How well did your college prepare you for the labor market?', 'type' => 'radio', 'answers' => $this->answers(['Not at all', 'Very little', 'Somewhat', 'Mostly', 'Completely']), 'order' => 3],
                    ['text' => 'E4. Perceptions of employment opportunities in your field', 'type' => 'radio', 'answers' => $this->answers(['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']), 'order' => 4],
                    ['text' => 'E5. Graduate studies are required for career advancement', 'type' => 'radio', 'answers' => $this->agreementScale5(), 'order' => 5],
                    ['text' => 'E6. Suggestions for improving higher education curriculum', 'type' => 'textarea', 'placeholder' => 'Your suggestions...', 'order' => 6],
                    ['text' => 'E7. Additional comments on education, employment, or skills', 'type' => 'textarea', 'placeholder' => 'Any additional comments...', 'order' => 7],
                ],
            ],
        ];
    }
}
