class Equation{
    constructor(equation_str){
        equation_str = equation_str.toUpperCase();
        equation_str = equation_str.replace(/\s/g, '');
        this.equation_str = equation_str;
        if (this.check_basic_errors() !== true){
            return ;
        }
        this.add_plus(equation_str);
        const splits = this.equation_str.split('=');
        if (splits.length != 2){
            console.log(`The equation must have two sides separated by =`);
            return ;
        }else{
            this.rhs = new Polynomial(splits[0]);
            this.lhs = new Polynomial(splits[1]);
            this.rhs.coeff.sort((a, b) => a.key - b.key);
            this.lhs.coeff.sort((a, b) => a.key - b.key);
        }
        this.equ = this.process_polynomes();
        this.degree = 0;
        if (this.equ.length > 0){
            this.degree = this.equ[this.equ.length - 1].key;
        }else{
            console.log(`Reduced form: 0 = 0\nPolynomial degree: 0\nAny number as solution`);
            return ;
        }
        this.reduced_equation();
        if (this.check_equation_degree() === true)
        {
            this.solve_equation();
        }
    }

    check_basic_errors(){
        let array = this.equation_str;
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if ('0123456789.-+*^X='.indexOf(element) < 0){
                console.log(element);
                console.log('Bad equation format allowed characters : [0123456789-+*X= ]');
                return false;
            }
        }
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element >= '0' && element <= '9'){
                if (index > 0){
                    if ('0123456789.-+*^='.indexOf(array[index - 1]) < 0){
                        console.log('Error bad format ');
                        return false;
                    }
                    if (index + 1 < array.length && '0123456789.-+*^=X'.indexOf(array[index + 1]) < 0){
                        console.log('Error bad format ' + element);
                        return false;
                    }
                }
            } else if (element === '='){
                if (index > 0){
                    if ('0123456789.X'.indexOf(array[index - 1]) < 0){
                        console.log('Error bad format ');
                        return false;
                    }
                    if (index + 1 >= array.length){
                        console.log(`Error bad format ` + element);
                        return false;
                    }
                    else if (index + 1 < array.length && '0123456789.-+X'.indexOf(array[index + 1]) < 0){
                        console.log('Error bad format ' + element);
                        return false;
                    }
                }
            }else if (element === '^'){
                if (index > 0){
                    if ('X'.indexOf(array[index - 1]) < 0){
                        console.log('Error bad format ' + element);
                        return false;
                    }
                    if (index + 1 >= array.length){
                        console.log('Error bad format ' + element);
                        return false;
                    }
                    let i = index + 1;
                    while (i < array.length && '+-='.indexOf(array[i]) < 0){
                        if ('0123456789'.indexOf(array[i]) < 0){
                            console.log('Error bad format ' + element);
                            return false;
                        }
                        i++;
                    }
                }else{
                    console.log('Error bad format ' + element);
                    return false;
                }
            }else if (element === 'X'){
                if (index > 0){
                    if ('0123456789.+-*='.indexOf(array[index - 1]) < 0){
                        console.log('Error bad format ' + element);
                        return false;
                    }
                    if (index + 1 >= array.length){
                        console.log('Error bad format ' + element);
                        return false;
                    }
                    if (index + 1 < array.length && '^'.indexOf(array[index + 1]) < 0){
                        console.log('Error bad format ' + element);
                        return false;
                    }
                }
            }else if (element === '-' || element === '+'){
                if (index > 0){
                    if ('0123456789.*X='.indexOf(array[index - 1]) < 0){
                        console.log('Error bad format ' + element);
                        return false;
                    }
                    if (index + 1 >= array.length){
                        console.log('Error bad format ' + element);
                        return false;
                    }
                    if (index + 1 < array.length && '0123456789.X'.indexOf(array[index + 1]) < 0){
                        console.log('Error bad format ' + element);
                        return false;
                    }
                }
            }
            else if (element === '*'){
                if (index > 0){
                    if ('0123456789.X'.indexOf(array[index - 1]) < 0){
                        console.log('Error bad format ' + element);
                        return false;
                    }
                    if (index + 1 >= array.length){
                        console.log('Error bad format ' + element);
                        return false;
                    }
                    if (index + 1 < array.length && 'X'.indexOf(array[index + 1]) < 0){
                        console.log('Error bad format ' + element);
                        return false;
                    }
                }else{
                    console.log('Error bad format ' + element);
                    return false;
                }
            }
            else if (element === '.'){
                if ('0123456789'.indexOf(array[index - 1]) < 0){
                    console.log('Error bad format ' + element);
                    return false;
                }
                if (index + 1 < array.length && '0123456789'.indexOf(array[index + 1]) < 0){
                    console.log('Error bad format ' + element);
                    return false;
                }
            }
        }
        return true;
    }

    process_polynomes(){
        let result = [];
        for (let index = 0; index < this.rhs.coeff.length; index++) {
            const element = this.rhs.coeff[index];
            const index2 = this.lhs.coeff.findIndex(elem => elem.key === element.key);
            if (index2 === -1){
                result.push(element);
            }else{
                const monome = {key: element.key, value : this.rhs.coeff[index].value - this.lhs.coeff[index2].value}
                result.push(monome);
                this.lhs.coeff.splice(index2, 1);
            }
        }
        for (let index = 0; index < this.lhs.coeff.length; index++){
            result.push(this.lhs.coeff[index])
        }
        result = result.filter(monome => monome.value !== 0);
        result.sort((a, b) => a.key - b.key);
        return result;
    }

    reduced_equation(){
        let array = this.equ;
        let red_str = ``;
        let degree = this.degree;
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            const value = element.value;
            if (value < 0){
                red_str += ` - ${-parseFloat(value.toFixed(6))} * X^${element.key}`;
            }
            else if (value > 0){
                red_str += index > 0 ? ' + ' : '';
                red_str += `${parseFloat(value.toFixed(6))} * X^${element.key}`;
            }
        }
        if (red_str != ''){
            red_str += ` = 0`
        }
        console.log(`Reduced form: ${red_str}`);
        console.log(`Polynomial degree: ${degree}`);
    }

    check_equation_degree(){
        if (this.degree > 2){
            console.log(`The polynomial degree is strictly greater than 2, I can't solve.`);
            return false;
        }
        let toFind;
        toFind = this.equ.find(elem => elem.key === 2)
        this.a = toFind ? toFind.value : 0;
        toFind = this.equ.find(elem => elem.key === 1)
        this.b = toFind ? toFind.value : 0;
        toFind = this.equ.find(elem => elem.key === 0)
        this.c = toFind ? toFind.value : 0;
        return true;
    }

    solve_equation(){
        if (this.a === 0){
            if (this.b === 0){
                if (this.c === 0){
                    this.print_any_solution();
                }else{
                    this.print_no_solution();
                }
            }
           else
            {
                let s = -this.c / this.b;
                this.print_one_solution(s);
            }
        }else{
            const Sqrt = number => {
                let end = 1;

                if (number < 0) {
                  return NaN;
                }
              
                if (number == 0 || number == 1) {
                  return number;
                }
                while (end * end < number) {
                  end++;
                }
                let i = 0;
                let start = end - 1;
                let mid = (start + end) / 2;
              
                while (mid * mid != number) {
                  if (mid * mid > number) {
                    end = mid;
                  } else {
                    start = mid;
                  }
                  if (mid == (start + end) / 2) {
                    break;
                  }
                  mid = (start + end) / 2;
                  i++;
                }
                return mid;
            };
            let delta = this.b * this.b - 4 * this.a * this.c;
            if (delta < 0){
                delta = -delta;
                delta = Sqrt(delta);
                let real = (-this.b) / ( 2 * this.a);
                this.print_complex_solutions(real, delta / (2 * this.a));
            }else if (delta === 0){
                let s = -this.b / (2 * this.a);
                this.print_one_solution(s);
            }else{
                let s1, s2;
                delta = Sqrt(delta);
                s1 = (-this.b - delta) / ( 2 * this.a);
                s2 = (-this.b + delta) / (2 * this.a);
                this.print_two_solutions(s1, s2);
            }
        }
    }

    print_no_solution(){
        console.log(`no solution`);
    }

    print_one_solution(s){
        console.log(`The solution is:`);
        console.log(parseFloat(s.toFixed(6)));
    }

    print_two_solutions(s1, s2){
        console.log(`Discriminant is strictly positive, the two solutions are:`);
        console.log(parseFloat(s1.toFixed(6)));
        console.log(parseFloat(s2.toFixed(6)));
    }

    print_complex_solutions(real, delta){
        console.log(`Discriminant is strictly negative, the two solutions are:`);
        if (delta > 0)
        {
            console.log(`${parseFloat(real.toFixed(6))} - ${parseFloat(delta.toFixed(6))}i`);
            console.log(`${parseFloat(real.toFixed(6))} + ${parseFloat(delta.toFixed(6))}i`);
        }else{
            console.log(`${parseFloat(real.toFixed(6))} + ${parseFloat(-delta.toFixed(6))}i`);
            console.log(`${parseFloat(real.toFixed(6))} - ${parseFloat(-delta.toFixed(6))}i`);
        }
    }

    print_any_solution(){
        console.log(`Any number as solution`);
    }

    add_plus(equation_str){
        this.equation_str = equation_str.replace(/\-/g, '+-');
    }
}

class Polynomial{
    constructor(polynomial_str){
        this.polynomial_str = polynomial_str;
        this.coeff = [];
        try{
            this.parse();
        }catch(err){ console.log(err);}
    }

    parse_ab(a_monome_str){
        let n = a_monome_str.indexOf('X');
        if (n === 0){
            a_monome_str = '1'+a_monome_str.substring(n);
        }else if (n === 1 && a_monome_str[0] === '-'){
            a_monome_str = a_monome_str.substring(0,n)+'1'+a_monome_str.substring(n);
        }
        return parseFloat(a_monome_str);
    }

    parse(){
        const re = '+';
        const splites = this.polynomial_str.split(re);
        splites.forEach(split => {
            if (split.length === 0 || !split.trim()){
               return false;
            }
            let exponent = parseInt(split.split('^')[1], 10);
            if (isNaN(exponent)){
                if (split.includes('X') === false){
                    split = split + 'X^0';
                    exponent = 0;
                }else{
                    split = split + 'X^1';
                    exponent = 1;
                }
            }
            {
                let coefIndex = this.coeff.findIndex(coef => coef.key === exponent);
                if (coefIndex === -1){
                    this.coeff.push({key:exponent, value: this.parse_ab(split)});
                }else{
                    this.coeff[coefIndex].value += this.parse_ab(split);
                }
            }
        });
        return true;
    }
}

if (process.argv.length == 3){
    const equation = new Equation(process.argv[2]);
}else{
    console.log(`Usage: node index.js "5 + 4 * X + X^2 = X^2"`);
}
