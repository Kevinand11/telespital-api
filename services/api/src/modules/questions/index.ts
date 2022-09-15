import { AnswerRepository } from './data/repositories/answers'
import { QuestionRepository } from './data/repositories/questions'
import { SubjectRepository } from './data/repositories/subjects'
import { AnswersUseCase } from './domain/useCases/answers'
import { QuestionsUseCase } from './domain/useCases/questions'
import { SubjectsUseCase } from './domain/useCases/subjects'

const answerRepository = AnswerRepository.getInstance()
const questionRepository = QuestionRepository.getInstance()
const subjectRepository = SubjectRepository.getInstance()

export const AnswersUseCases = new AnswersUseCase(answerRepository)
export const QuestionsUseCases = new QuestionsUseCase(questionRepository)
export const SubjectsUseCases = new SubjectsUseCase(subjectRepository)

export { AnswerFromModel } from './data/models/answers'
export { QuestionFromModel } from './data/models/questions'
export { SubjectFromModel } from './data/models/subjects'

export { AnswerEntity } from './domain/entities/answers'
export { QuestionEntity } from './domain/entities/questions'
export { SubjectEntity } from './domain/entities/subjects'
