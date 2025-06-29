
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../contexts/BlogContext';
import { ArrowRight, RefreshCw, Edit } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 'topic',
    question: 'What is your blog post about?',
    options: ['Technology', 'Lifestyle', 'Business', 'Health', 'Travel', 'Education', 'Entertainment', 'Other']
  },
  {
    id: 'audience',
    question: 'Who is your target audience?',
    options: ['Beginners', 'Professionals', 'Students', 'General Public', 'Experts', 'Entrepreneurs']
  },
  {
    id: 'tone',
    question: 'What tone do you want to convey?',
    options: ['Informative', 'Conversational', 'Professional', 'Humorous', 'Inspirational', 'Analytical']
  },
  {
    id: 'format',
    question: 'What type of content are you creating?',
    options: ['How-to Guide', 'List Article', 'Opinion Piece', 'News/Update', 'Review', 'Case Study', 'Tutorial']
  }
];

const TitleGenerator = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { saveDraft } = useBlog();

  const handleAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateTitles(newAnswers);
    }
  };

  const generateTitles = async (userAnswers: Record<string, string>) => {
    setIsGenerating(true);
    
    // Simulate API call to generate titles
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const titleTemplates = [
      `The Ultimate Guide to ${userAnswers.topic} for ${userAnswers.audience}`,
      `How to Master ${userAnswers.topic}: A ${userAnswers.tone} Approach`,
      `${userAnswers.topic} Secrets Every ${userAnswers.audience} Should Know`,
      `The Complete ${userAnswers.format} for ${userAnswers.topic}`,
      `10 Essential ${userAnswers.topic} Tips for ${userAnswers.audience}`,
      `${userAnswers.topic} Made Simple: A ${userAnswers.tone} Guide`,
      `Why ${userAnswers.topic} Matters in 2024`,
      `Transform Your ${userAnswers.topic} Knowledge Today`
    ];
    
    setGeneratedTitles(titleTemplates.slice(0, 6));
    setIsGenerating(false);
  };

  const regenerateTitles = () => {
    generateTitles(answers);
  };

  const startBlog = () => {
    if (selectedTitle) {
      // Save as draft with the selected title
      saveDraft({
        title: selectedTitle,
        content: '',
        excerpt: '',
        author: 'Current User',
        authorAvatar: '',
        tags: [answers.topic],
        readingTime: 0
      });
      
      navigate('/editor', { state: { title: selectedTitle } });
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetGenerator = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setGeneratedTitles([]);
    setSelectedTitle('');
  };

  if (generatedTitles.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
              Here are your generated titles!
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-400">
              Choose the one that resonates with you the most
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-8">
            {isGenerating ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-slate-400">Generating amazing titles for you...</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {generatedTitles.map((title, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedTitle(title)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        selectedTitle === title
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-600/20'
                          : 'border-gray-200 dark:border-slate-600 hover:border-violet-300 dark:hover:border-violet-700'
                      }`}
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100">
                        {title}
                      </h3>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={regenerateTitles}
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Generate New Titles
                  </button>
                  
                  <button
                    onClick={startBlog}
                    disabled={!selectedTitle}
                    className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-violet-500/25"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Start Blog
                  </button>
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={resetGenerator}
                    className="text-gray-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    Start over with new questions
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            Blog Title Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-slate-400">
            Answer a few questions to generate the perfect title for your blog post
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-violet-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-600 dark:text-slate-400">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              {questions[currentQuestion].question}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(questions[currentQuestion].id, option)}
                  className="p-4 text-left border border-gray-200 dark:border-slate-600 rounded-lg hover:border-violet-600 dark:hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-600/20 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-slate-100 font-medium group-hover:text-violet-600 dark:group-hover:text-violet-400">
                      {option}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {currentQuestion > 0 && (
            <div className="flex justify-between">
              <button
                onClick={goBack}
                className="px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                Previous
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleGenerator;
