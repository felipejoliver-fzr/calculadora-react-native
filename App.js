/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import Button from './src/components/Button'
import Display from './src/components/Display'

const initialState = {
  displayValue: '0',
  clearDisplay: false,
  operation: null,
  values: [0,0],
  current: 0
}

export default class App extends Component {

  state = {...initialState}

  addDigit = valorDigitado => {
  
    //a variavel clearDisplay sera true caso o display contenha o 0 ou
    //caso o estado seja para limpar o display
    const clearDisplay = this.state.displayValue === '0'
    || this.state.clearDisplay

    //não permite inserir mais de uma vez o ponto mas caso o usuario va limpar o display ele permite
    if (valorDigitado === '.' && !clearDisplay
       && this.state.displayValue.includes('.')){
      return 
    }

    const currentValue = clearDisplay ? '' : this.state.displayValue
    
    //concatena o valor que ja esta no display com o que foi digitado ou limpo
    const displayValue = currentValue + valorDigitado
    this.setState({ displayValue, clearDisplay: false})

    //insere o valor digitado na posição do array em que está sendo utilizado
    //baseado no current ele ira setar no indice zero ou no um
    if (valorDigitado !== '.'){
      const newValue = parseFloat(displayValue)
      const values = [...this.state.values]
      values[this.state.current] = newValue
      this.setState({ values })

    }

  }

  clearMemory = () => {
    this.setState({ ...initialState })
  }

  setOperation = operation => {
    //quando a operação for setada e o current for igual a 0, sera inserido no state a operation selecionada
    //sera atualizado o current para 1, ou seja, o proximo valor selecionado sera inserido na segunda posição do array de valores
    //e o clearDisplay sera setado como true para quando o segundo valor por selecionado, limpar o display e mostrar o segundo valor digitado
    if(this.state.current === 0) {
      this.setState({ operation, current: 1, clearDisplay: true })
    }else {
      const equals = operation === '='
      const values = [...this.state.values]
      try{
        //o eval avalida a expressao passada para ele e retorna o valor da expressao
        //no caso abaixo estou passando o valor de indice 0, com a expressao e o valor de indice 1
        values[0] = eval(`${values[0]} ${this.state.operation} ${values[1]}`)
      }catch (e){
        //caso seja inserido uma expressao inválida, por exemplo: 2 = 2
        //assim garante inserir o valor correto e nao quebrar a app
        values[0] = this.state.values[0]
      }

      //o segundo valor receberá zero
      values[1] = 0
      this.setState({
        //o primeiro valor receberá o resultado da operação
        displayValue: `${values[0]}`, //faz com que values[0] sempre seja uma string
        //se a operacao que ja esta no operation for igual a que foi inserida para efetuar a operacao acima receberá null
        //se não for igual, irá receber a operação setada para realizar uma nova expressão
        operation: equals ? null : operation,
        //se o valor current for igual ele permanecerá 0 pois irá setar o resultado sempre no indice 0
        //se for diferente irá setar o current no 1 pois ele entederá que é uma nova operação
        current: equals ? 0 : 1,
        //sempre setar o contrario de clearDisplay
        clearDisplay: !equals,
        values,
      })
      
    }
  }
  
  render() {
    return (
      <View style={styles.container}>

      <Display value={this.state.displayValue} />

      <View style={styles.buttons}>
        <Button label='AC' triple onClick={this.clearMemory}/>
        {/* <Button label='/' operation onClick={() => this.setOperation('/')}/> */}
        <Button label='/' operation onClick={this.setOperation}/>
        <Button label='7' onClick={this.addDigit}/>
        <Button label='8' onClick={this.addDigit}/>
        <Button label='9' onClick={this.addDigit}/>
        <Button label='*' operation onClick={this.setOperation}/>
        <Button label='4' onClick={this.addDigit}/>
        <Button label='5' onClick={this.addDigit}/>
        <Button label='6' onClick={this.addDigit}/>
        <Button label='-' operation onClick={this.setOperation}/>
        <Button label='1' onClick={this.addDigit}/>
        <Button label='2' onClick={this.addDigit}/>
        <Button label='3' onClick={this.addDigit}/>
        <Button label='+' operation onClick={this.setOperation}/>
        <Button label='0' double onClick={this.addDigit}/>
        <Button label='.' onClick={this.addDigit}/>
        <Button label='=' operation onClick={this.setOperation}/>
      </View>
    </View>
    )
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});