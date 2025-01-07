// Project Class
enum ProjectStatus {
  Active,
  Finished,
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public numOfPeople: number,
    public status: ProjectStatus = ProjectStatus.Active
  ) {}
}
// listener type
type Listener = (item: Project[]) => void
// Project State

class ProjectState {
  private listeners: Listener[] = []
  private projects: Project[] = []
  private static instance: ProjectState

  private constructor() {}

  // one one instance
  static getInstance() {
    if (this.instance) return this.instance
    this.instance = new ProjectState()
    return this.instance
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople
    )
    this.projects.push(newProject)

    // listen to listener function when ever new project added
    // listener function gets a copy of projects
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice())
    }
  }

  // add new listener
  // each listener lopped in project function have a copy project
  addListeners(listenerFn: Listener) {
    this.listeners.push(listenerFn)
  }
}

// global project list state instance
const projectState = ProjectState.getInstance()

// validate interface and function for user inputs
interface ValidatableInputProps {
  value: string
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

// Validate Algorithim
// check if value string
// - check if value.length > 0
// - check if  value.length >= minlength
// - check if  value.length <= maxlength
// check if value is number
// - check if value >= min
// - check if value <= max

function validateInput({
  value,
  max,
  min,
  maxLength,
  minLength,
}: ValidatableInputProps) {
  // result
  let isValid = true

  // string type input
  if (typeof value === "string") {
    // minlength ?
    if (minLength) {
      isValid = isValid && value.length >= minLength
    }

    // maxlength ?
    if (maxLength) {
      isValid = isValid && value.length <= maxLength
    }
  }

  // number type input
  if (typeof value === "number") {
    // min ?
    if (min) {
      isValid = isValid && value >= min
    }
    // max ?
    if (max) {
      isValid = isValid && value <= max
    }
  }
  return isValid
}

function validate(validatableInputs: ValidatableInputProps) {
  // if is required is on
  let isValid = true
  // if string check if length is not equal to 0
  if (validatableInputs.required) {
    isValid = isValid && validatableInputs.value.trim().toString().length !== 0
  }

  // check string minlength
  if (
    validatableInputs.minLength != null &&
    typeof validatableInputs.value === "string"
  ) {
    isValid =
      isValid && validatableInputs.value.length >= validatableInputs.minLength
  }

  // check string maxlenfth
  if (
    validatableInputs.maxLength != null &&
    typeof validatableInputs.value === "string"
  ) {
    isValid =
      isValid && validatableInputs.value.length <= validatableInputs.maxLength
  }

  // check min number
  if (
    validatableInputs.min != null &&
    typeof validatableInputs.value === "number"
  ) {
    isValid = isValid && +validatableInputs.value >= validatableInputs.min
  }

  // check max number
  if (
    validatableInputs.max != null &&
    typeof validatableInputs.value === "number"
  ) {
    isValid = isValid && +validatableInputs.value <= validatableInputs.max
  }

  //return result
  return isValid
}

// Project List Class
class ProjectList {
  templateElement: HTMLTemplateElement
  hostElement: HTMLDivElement
  templateChildElement: HTMLElement
  assignedProjects: Project[]
  constructor(private type: "active" | "finished") {
    // get the UI template with ID: project-list
    this.templateElement = document.getElementById(
      "project-list"
    ) as HTMLTemplateElement

    // get the host UI template with ID: app
    this.hostElement = document.getElementById("app") as HTMLDivElement

    // copied project
    this.assignedProjects = []
    // get the deepCopy of the template content
    const importedTempleNode = document.importNode(
      this.templateElement.content,
      true
    )

    // from the deep copy get the first Child Element
    this.templateChildElement =
      importedTempleNode.firstElementChild as HTMLElement
    console.log("child", this.templateChildElement)
    this.templateChildElement.id = `${type}-projects`

    // register listener whch have access to copy of project state
    projectState.addListeners((projects: Project[]) => {
      this.assignedProjects = projects
      this.renderProjects()
    })

    // once the place, where to, attach the project list section
    this.attach()

    // render the active || finished project into project list section
    this.renderContent()
  }

  // render projects when listener activate
  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-project-list`)
    for (const projectItem of this.assignedProjects) {
      const listItem = document.createElement("li")
      listItem.textContent = projectItem.title
      listEl?.appendChild(listItem)
    }
  }
  /**
   * Create id: active-project-list || finished-project-list
   * attach the id to project section to identify which project it is
   * add the heading to that section based on the project type: this.type
   * */

  private renderContent() {
    const listId = `${this.type}-project-list`
    // add id to Unordered List in projects templatechildElement

    this.templateChildElement.querySelector("ul")!.id = listId

    // add the heading h2 text in that section
    this.templateChildElement.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`
  }

  private attach() {
    this.hostElement.insertAdjacentElement(
      "beforeend",
      this.templateChildElement
    )
  }
}

// Project Input Class
class ProjectInput {
  templateElement: HTMLTemplateElement
  hostElement: HTMLDivElement
  templateChildElment: HTMLFormElement
  titleInputElement: HTMLInputElement
  descriptionElement: HTMLInputElement
  peopleInputElement: HTMLInputElement
  constructor() {
    // get the UI template with ID: project-input
    this.templateElement = document.getElementById(
      "project-input"
    ) as HTMLTemplateElement

    // get the host UI template with ID: app
    this.hostElement = document.getElementById("app") as HTMLDivElement

    // get the deepCopy of the template content
    const importedTempleNode = document.importNode(
      this.templateElement.content,
      true
    )

    // from the deep copy get the first Child Element
    this.templateChildElment =
      importedTempleNode.firstElementChild as HTMLFormElement
    console.log("child", this.templateChildElment)
    this.templateChildElment.id = "user-input"
    // AFTER GETTING THE FIRST CHLD ATTACH IT TO THE HOST ELEMENT
    this.attach()

    // get the input fields from the child element i.e. form
    this.titleInputElement = this.templateChildElment.querySelector(
      "#title"
    ) as HTMLInputElement
    this.descriptionElement = this.templateChildElment.querySelector(
      "#description"
    ) as HTMLInputElement
    this.peopleInputElement = this.templateChildElment.querySelector(
      "#people"
    ) as HTMLInputElement

    // add the configure setting to instance/class
    this.configure()
  }

  // Attach the template form-input to the hostElement
  private attach() {
    this.hostElement.insertAdjacentElement(
      "afterbegin",
      this.templateChildElment
    )
  }

  // Configure the form submit event handler with bind
  private configure() {
    this.templateChildElment.addEventListener(
      "submit",
      this.submitHandler.bind(this)
    )
  }

  // form submithandler function
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUserInputs()
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput
      projectState.addProject(title, desc, people)
      this.clearInput()
    }
  }

  // gather the user inputs
  private gatherUserInputs(): [string, string, number] | void {
    const title = this.titleInputElement.value
    const validateTitle: ValidatableInputProps = {
      value: title,
      required: true,
    }
    const description = this.descriptionElement.value
    const validateDescription: ValidatableInputProps = {
      value: description,
      required: true,
      minLength: 5,
    }
    const people = this.peopleInputElement.value
    const validatePeople: ValidatableInputProps = {
      value: description,
      required: true,
      min: 1,
      max: 10,
    }
    //check if empty
    if (
      !validateInput(validateTitle) ||
      !validateInput(validateDescription) ||
      !validateInput(validatePeople)
    ) {
      alert("Invalid Input, please try again!")
      return
    } else {
      return [title, description, +people]
    }
  }

  // function to clear the input once submit handler is done, correctly
  private clearInput(): void {
    this.titleInputElement.value = ""
    this.descriptionElement.value = ""
    this.peopleInputElement.value = ""
  }
}

// form Initalized
const dragDrop = new ProjectInput()
// active project Section Initalized
const activeProjectList = new ProjectList("active")
// finished project Section Initalized
const finishedProjectList = new ProjectList("finished")
