const ASK_QUESTION_ENDPOINT = '/Prod/askquestion'
const RESOURCES_ENDPOINT =
    'https://raw.githubusercontent.com/ScriptAutomate/aws-cfn-resource-specs/master/specs/us-east-1/CloudFormationResourceSpecification.json'

const submit = (text) => {
    document.getElementById('md').innerHTML = 'Loading...'
    const options = {
        method: 'POST',
        body: JSON.stringify({
            input: text
        })
    }

    fetch(ASK_QUESTION_ENDPOINT, options)
        .then((x) => x.json())
        .then((x) => {
            const answer = x.data
            document.getElementById('md').innerHTML = answer
        })
        .catch(() => {
            document.getElementById('md').innerHTML = 'Error'
        })
}

const getCloudformationResources = () => {
    fetch(RESOURCES_ENDPOINT)
        .then((x) => x.json())
        .then((x) => {
            let html = ''
            Object.keys(x.ResourceTypes).forEach((name) => {
                const nameId = name.replaceAll(':', '').toLowerCase()
                const button = `<button id="${nameId}">${name}</button>`
                html = html + button
            })

            document.getElementById('side-panel').innerHTML = html
            return x
        })

        .then((x) => {
            Object.keys(x.ResourceTypes).forEach((name) => {
                const id = name.replaceAll(':', '').toLowerCase()
                document.getElementById(id).addEventListener('click', () => {
                    submit(name)
                })
            })
        })
}

getCloudformationResources()
